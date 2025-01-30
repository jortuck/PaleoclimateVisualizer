[![Front End Status](https://status.jortuck.com/api/badge/6/status?style=for-the-badge)](https://status.jortuck.com/status/pv)

# About

This website contains interactive visuals and charts for the study "Strengthening Southern
Hemisphere Westerlies and Amundsen Sea Low Deepening Over the 20th Century Revealed by Proxy-Data
Assimilation" which can be
read [here](https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2021GL095999).

The app makes uses of the following technologies:

- [SvelteKit (Svelte 5)](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Highcharts](https://www.highcharts.com/)

> [!IMPORTANT]
> Highcharts is a product that requires a license to use. If you intend to host this website
> yourself,
> or fork it to make your own variation, you must obtain a license from
> [highcharts.com](https://shop.highcharts.com/). If you are affiliated with an educational
> institution
> (student, staff, faculty), you can obtain a free license
> [here](https://shop.highcharts.com/contact/educational). Be advised that you must renew your
> education
> license **every year**.

## Contributing

Here is a guide to get started making contributions to this website.
> [!NOTE]
> In order to successfully run and test the website, you must have access to some version of the
> API. You can use the public API endpoint `https://pvapi.jortuck.com` in your env file, or you can
> self-host it yourself using the instructions in
> the [API repository](https://github.com/jortuck/PaleoClimateVisualizerAPI).

### Getting Started

#### Requirements

You must have the following software installed on your computer to develop on this website locally:

- [NodeJS](https://nodejs.org/)
- [Git](https://git-scm.com/)

<details>

<summary>Setting Up An Editor</summary>

If you already have a preferred setup on your system, or you are already familiar with working on
this type of project, you may skip these steps.

If you do not have an editor installed on your device, or you want to try something new, I would
recommend [Visual Studio Code](https://code.visualstudio.com/). It's free, open source, and has a
ton of great extensions to improve your developer experience. If working on this project, I would
suggest installing the following extensions:

- [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) -
  adds support for .svelte files.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  \- allows for a better experience when working with [TailwindCSS](https://tailwindcss.com).

</details>

#### Developing

1. Clone the repository using `git clone https://github.com/jortuck/PaleoclimateVisualizer.git`.
2. CD into the folder using `cd ./PaleoclimateVisualizer`, or you can open the folder in your
   favorite
   editor that supports running terminal commands.
3. Install NPM dependencies by using `npm install`.
4. Next, clone `.env.example` and rename it to `.env`. By default, the API host is set to one that
   would be running locally. If you do not have the API running locally, set `PUBLIC_API_HOST` to
   `https://pvapi.jortuck.com`.
5. Now, you should be able to run the development site using `npm run dev`.

#### Documentation

This app uses several frameworks and libraries to make life a bit easier. It is in your best
interest
to follow the conventions of these frameworks to avoid breaking issues. Below is a description of
each
major library and a link to its documentation.

- [SvelteKit](https://kit.svelte.dev/docs/introduction) - SvelteKit is the base of this entire
  application. It is responsible for rendering and serving all the pages for the user.
- [Svelte 5](https://svelte-5-preview.vercel.app/docs/introduction) - Svelte 5 is used by SvelteKit
  (hence the similar name) and provides the system for site components. Anything interactivity is
  written using Svelte.
- [TailwindCSS](https://tailwindcss.com/docs/installation) - TailwindCSS provides a vast amount of
  CSS utility classes that can be combined to make awesome components. It makes writing responsive
  CSS a lot faster.
- [DaisyUI](https://daisyui.com/docs/install/) - Daisy UI is a CSS component library built on top
  of TailwindCSS. You can take almost any component from their website and use it on this one, then
  customize it with classes from Tailwind.



