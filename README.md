<h1 align="center">
Minecraft Glyph Database (MGD)
<br>
</h1>

<h4 align="center"> A comprehensive, searchable list of all default glyphs in Java-Minecraft's font textures. 

</h4>


<p align="center">
  <a href="#about-the-project">About the Project</a> · <a href="#self-hosting">Self Hosting</a> · <a href="#disclaimer">Disclaimer</a> · <a href="#license">License</a>
</p>

<div align="center">
<img src="readme/Screenshot.png">
</div>

## About the Project

The Minecraft Glyph Database (MGD) provides a comprehensive and searchable collection of all default glyphs found within Java Edition of Minecraft's font textures. This project aims to offer an easy way to explore and understand the intricate font system used in the game. It was initially built for [Text2Book](https://github.com/TheWilley/Text2Book).

You can read more about the project in the [ABOUT document](ABOUT.md).


## Self-Hosting
> [!NOTE] 
> [Node.js](https://nodejs.org/en) is required to run this project.

This project is divided into two main components: the **Generator** (a JSON compiler) and the **Webpage** (the GUI/Frontend).


To set up the webpage for self-hosting, you must first complete the steps outlined in the [Generator](https://www.google.com/search?q=%23generator) section, followed by the [Webpage](https://www.google.com/search?q=%23webpage) section.

### Generator

The generator script creates a `glyphs.json` file. This JSON file contains data for each glyph, including:

  * Base64 encoded glyph textures
  * Glyph character representations
  * Unicode character representations
  * Glyph widths
  * The bitmap file where the glyph is located
  * The position of the glyph within its bitmap

#### Generator Setup

To set up the generator and extract Minecraft glyphs, follow these steps:

```bash
# 1. Navigate to the generator's source directory
cd generator/src

# 2. Install required Node.js packages
npm install

# 3. Generate glyphs.json
#    Provide the full path to your Minecraft version JAR file.
#    This command will create a 'glyphs.json' file in 'generator/dist/'.
node .\generator.js --path "C:\Users\YourUsername\AppData\Roaming\.minecraft\versions\1.21\1.21.jar"
```

### Webpage

The webpage provides the interactive user interface for viewing and searching the generated glyphs.

#### Webpage Setup Steps

```bash
# 1. Navigate to the webpage directory
cd webpage

# 2. Install required Node.js packages
npm install

# 3. Move the generated glyphs.json file
#    Copy 'glyphs.json' from 'generator/dist/' to 'webpage/public/'.
#    This step can be done manually or with a copy command
copy ..\generator\dist\glyphs.json public

# 4. Build the webpage for production
npm run build

# 5. Preview the built webpage locally
#    Alternatively, upload the contents of the 'dist' folder (created by 'npm run build')
#    to your preferred static web host
npm run preview
```

## Disclaimer

This project, made for educational purposes, is not affiliated with Mojang Studios or Microsoft, may contain copyrighted textures. It is not monetized and does not negatively impact Minecraft's brand. Should Mojang or Microsoft request its removal, the webpage will be taken down immediately.

## License

[MIT](LICENSE)