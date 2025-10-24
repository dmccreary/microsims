# Anthropic Claude Skill

A Claude Skill is a detailed collection of step-by-step rules and template
files that the Anthropic system uses to complete tasks.

## Using the p5 MicroSim Skill

## Step 1: Upload the MicroSim Skill to your Anthropic Claude System

If you have the Anthropic Claude Pro $20/month subscription you can go to the following location:

[http://claude.ai/settings/capabilities](http://claude.ai/settings/capabilities)

[Claude Skill Upload](./claude-screen-image-1.png)

From this page you can upload the MicroSim skill from our MicroSim GitHub web site:

[https://github.com/dmccreary/microsims/blob/main/skills/microsim-p5.zip](https://github.com/dmccreary/microsims/blob/main/skills/microsim-p5.zip)

## Step 2: Generating an New MicroSim Using the Skill

To run this skill you just need to mention it in your prompt:

!!! prompt
    Using the microsim.p5 skill, create a new MicroSim that does X.

This will generate a zip file you can download to your local computer.

## Step 3: Download and Test the MicroSim using the p5.js Editor

Next, you can click the "Download" button next to the generated file.
Unzip this file using the tools on your desktop or use the command line
tool unzip:

```sh
unzip MicroSim.zip
```

## Step 4: Installing the MicroSim Package

We have created a MiroSim Skill that you can use to generate p5 MicroSims.
This skill will generate a MicroSim "package" which is a zip file.  The
zip file contains the following items:

1. an index.md file with an 'iframe' reference and descriptive details about the MicroSim
2. a main.html file that will run the MicroSim
3. a JavaScript file
4. a metadata.json file to store information about the MicroSim

You can then unzip this package in the `/docs/sims` folder, edit the mkdocs.yml file and
you are ready to test your MicroSim.

The javascript file is designed to work with the p5.js editor for easy testing and modification.


[How to Create a Custom Skill](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)