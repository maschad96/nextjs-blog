---
title: 'Building a Hugo website on Azure CDN and Blob Storage'
date: 2020-04-11T00:00:00+00:00
draft: false
tags: ['azure', 'static websites']
hasTOC: true
---

I recently built this blog with Hugo and thought I'd write a post about the process. To start, these are the following resources I used in Azure:

-   CDN
-   Storage Account
    -   Type: Blob
    -   The "Static Website" will be used in this example
-   DNS Zone
-   Azure DevOps
    -   DevOps Pipelines for Deployment

There are other simple ways to accomplish this such as GitHub Pages and Actions, but I'm doing it to learn more about Azure Services and play with the Pipelines feature.

Let's get into it! These are the steps that I followed in Azure:

## Set up the repo in DevOps

1. Put your static site on a GitHub repo
2. Navigate to [Azure Devops](https://dev.azure.com) and set up a project
3. Import the repo to DevOps using the clone URL, username, and a personal access token. Here's some direction on [how to set up a Personal Access Token (PAT)](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

Great, now you have your repo imported!

## Set up the Resource Group in Azure Portal

1. On the [Azure Portal Homepage](https://portal.azure.com), there is a section titled 'Navigate'. Under there, Resource Groups is listed
2. Add a new resource group and name it whatever you like; I used the 'personal-blog' naming convention, and named my other resources similarly to keep the list easy to parse

You should now have a resource group that Azure Services can be associated with.

## Set up the Storage Account in Azure Portal

1. Navigate to the Storage Accounts resource and click 'Add' (Here's a link for the lazy: [Create Microsoft Storage Account](https://portal.azure.com/#create/Microsoft.StorageAccount))
2. Select the resource group that we just created
3. Choose your storage account name (mine will be `personal-blog-storage`, matching my naming convention)
4. Select the region you'd prefer
5. Select the performance level you prefer; in my case, it's a small static site and not a critical service, so I've chosen "Standard" and "StorageV2" with "Read-access geo-redundant storage (RA-GRS)". My access tier is set to "Hot"
6. Navigate to the "Static Website" page, located under "Settings" in sidebar

    1. Enable the "Static Website" option, and clipboard the "Primary Endpoint" for the next steps
    2. Set the "Index document name" field to `index.html`

## Set up the CDN in Azure Portal

1. Set up your CDN Profile

    1. On the form to create a CDN profile, enter in the name of the profile, in my case `personal-blog-cdn`, select the subscription and resource group
    2. Select the desired pricing tier; the Premium Verizon option is good if you want to handle URL rewrites (www to non-www for example)
    3. Check the 'Create a new CDN endpoint now' radio field, and then:

        1. Name the endpoint
        2. Set the 'Origin hostname' to the value we saved from the "Static Website" panel when setting up the storage account (e.g: `https://storageaccountname.z19.web.core.windows.net/`)

    4. Submit, and allow that process to finish
    5. Navigate to the newly created CDN endpoint, and document the "Endpoint hostname" shown in the overview panel; this will be used in step 4 of the next section

## Set up the DNS zone and point the necessary records

1. Set up a DNS zone for your domain

    1. Point your domain to the Azure nameservers shown in the DNS Zone "Overview" panel
    2. Allow this to propagate; it should be rather quick. To check if the change is setup, use the appropriate command for your OS to check nameservers:

        - Linux/Mac: `dig ns yourdomainname.com`
        - Windows: `nslookup -type=ns yourdomainname.com`

2. Add an A record

    1. Set 'Alias Record Set' to 'Yes'
    2. Set 'Alias Type' to 'Azure Resource'
    3. Select your site's Subscription and Resource, and set TTL to 1 second

3. Map the cdnverify subdomain to validate the domain with the CDN.

    | Source                         | Type  | Destination                               |
    | ------------------------------ | ----- | ----------------------------------------- |
    | cdnverify.www.matthewschad.com | CNAME | cdnverify.cdn-endpoint-name.azureedge.net |

    ([Microsoft Docs Reference](https://docs.microsoft.com/en-us/azure/cdn/cdn-map-content-to-custom-domain))

4. Point a CNAME for www to your site

    1. Add a CNAME record
    2. Set the 'Name' to www
    3. Set the Alias to your CDN endpoint URL we documented<br><small>This will allow the CDN endpoint to validate the domain name that we add</small>

5. Add the domain name(s) to the CDN endpoint (both www and non-www) from the "Custom Domains" link in the left sidebar
6. Check DNS propagation with [whatsmydns.net](https://www.whatsmydns.net/)

## Set up the DevOps pipelines for git deployment to the storage account

### Set up the pipeline to generate the build artifact

We'll be working on two tasks in [Azure Devops](https://dev.azure.com/):

1. Set up the pipeline tasks that give us our build artifact
2. Set up the release pipeline that takes that build artifact and replaces the Storage Account file contents with the contents of our latest push

DevOps pipelines can be controlled from the GUI in DevOps, but in this case we'll create an `azure-pipelines.yml` file within our project that will be referenced in DevOps.

We'll use pipelines to make sure Hugo is updated to our desired point release, to build the blog, to copy the contents of the blog, and then upload those contents to a build artifact that will be accessible by our release pipeline. Pipelines are flexible and can include any other tasks or tests you might want to build into the process.

When configuring `azure-pipelines.yml`, I originally referenced [a tutorial written up by kurtkurtm](https://medium.com/@kurtmkurtm/setting-up-a-blog-with-the-hugo-framework-on-azure-blob-storage-12605609a90), but then added an additional
first task in the pipeline that will update my forked theme with what's in the master branch.

```yml
#
# Azure pipeline to build and publish a hugo blog release
# github.com/kurtmkurtm
#

trigger:
    - master

pool:
    vmImage: 'ubuntu-16.04'

variables:
    hugo.version: '0.55.6'
    blog.path: 'hugo-blog'

steps:
    - script: 'git submodule update --init --recursive'
      displayName: 'Update Theme'

    - script: |
          wget -c https://github.com/gohugoio/hugo/releases/download/v$(hugo.version)/hugo_$(hugo.version)_Linux-64bit.deb
      displayName: 'Download HUGO'

    - script: 'sudo dpkg -i hugo_$(hugo.version)_Linux-64bit.deb'
      displayName: 'Install HUGO'

    - script: |
          hugo --log -v
      displayName: 'Generate Blog'

    - task: CopyFiles@2
      displayName: 'Copy Blog'
      inputs:
          SourceFolder: 'public'
          Contents: '**'
          TargetFolder: '$(Build.ArtifactStagingDirectory)'

    - task: PublishBuildArtifacts@1
      displayName: Publish Blog
      inputs:
          PathtoPublish: '$(Build.ArtifactStagingDirectory)'
          ArtifactName: Drop
          publishLocation: 'Container'
```

After that config is created and your repo is connected to DevOps, push up any changes and create a pipeline referencing that ARM template in Azure Devops.

### Set up the release pipeline to update the Storage Account file contents

1. Go to Pipelines -> Releases, in the left-hand sidebar
2. Create a "new release pipeline", starting with an Empty job
3. Name your Stage "Deploy Site" or any name you prefer
4. Add an Artifact that will be dropped in
    1. Set "Source Type" to "Build"
    2. Set "Project" and "Source" to the right project and build pipeline
5. Navigate to the "Tasks" tab in the upper toolbar
6. Create an "Azure CLI" task for deleting the storage account contents
    1. Set the related subscription
    2. Set "Script Location" to "Inline Script", and use `az storage blob delete-batch --account-name {storage_account_name} --account-key {storage_account_key}`
7. Create an "Azure File Copy" task for dropping in the build artifact contents to `$web`
    1. Set the "Source" directory;
        1. Using the file explorer tool next to the input, select the Drop directory under your linked artifact
        2. Your selection should result in a value similar to: `$(System.DefaultWorkingDirectory)/linked_artifact_name/Drop`
    2. Set the "Container Name" to `$web`, the location of our webroot
    3. Under Control Options, set "Run this task" to "Only when all previous tasks have succeeded"

### Give it a spin

Push some changes in your repo and watch the pipeline output as it runs. If it completes, the release pipeline under "Releases" should then start. Update configuration as needed if it fails, and good luck!

#### Other neat features if you want to take performance a step further

You can set up caching rules to optimize performance within the CDN Endpoint settings. More information is located at the [CDN Caching Rules reference](https://docs.microsoft.com/en-us/azure/cdn/cdn-caching-rules).

With caching set up, a neat feature of Azure CDN is [Dynamic Delivery](https://docs.microsoft.com/en-us/azure/cdn/cdn-dynamic-site-acceleration), which is essentially route optimization and delivers cached content from a route closer to the user.
