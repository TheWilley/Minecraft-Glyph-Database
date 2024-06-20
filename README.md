# Minecraft Glyph Database (MGD)

Minecraft Glyph Database (MGD) is a comprehensive, searchable list of all default glyphs in Java-Minecraft's font textures.

![screenshot](readme/Screenshot%203.png)

## Table Of Contents

- [About Minecraft Fonts](#about-minecraft-fonts)
- [Self Hosting](#self-hosting)
  - [Generator](#generator)
    - [JSON Generation](#json-generation)
    - [Finding Textures Manually](#finding-textures-manually)
  - [Webpage](#webpage)
    - [Webpage Generation](#webpage-generation)
- [Disclaimer](#disclaimer)
- [License](#license)

## About Minecraft Fonts

![Fonts Overview](readme/Fonts%20Overview.png)  
_An overview of Minecraft's font hierarchy_

The Java version of Minecraft uses a typeface called Minecraft Seven, which includes four different fonts: **default**, **alt**, **uniform**, and **illageralt**.

- **alt** is used in enchanting tables.
- **uniform** is used when the "Force Unicode Font" option in Language settings is ON.
- **illageralt** is unused but can technically be accessed through a JSON text key.
- **default** is used in almost all situations.

The **default** font references four files: `ascii.png`, `accented.png`, `nonlatin_european.png`, and `unifont.zip`. All except `unifont.zip` are image files containing Minecraft glyphs. The `unifont.zip` file is a copy of GNU Unifont (15.0.06), a bitmap-based font used in many operating systems. It acts as a fallback for glyphs that no other provider has defined a texture for (i.e., certain languages without supported glyphs).

Each font is constructed from a list of "providers", which are sources that provide characters to use. These providers are defined within JSON files with the same name as the aforementioned fonts. The `chars` key found within the `providers` array in a given JSON file contains sequences of Unicode characters. Each entry in the array represents a row, with each Unicode character representing a column. This creates a [bitmap](https://www.britannica.com/technology/bitmap) where each item is mapped to the corresponding spot in the reference file. For example, the character "i" in `ascii.png` is located at the 7th row and 10th column, which corresponds to the Unicode representation `u0069` in the bitmap. Some parts of the texture are blank because `u0000` represents an empty or NULL value, acting as padding.

For this project, the `chars` key values are hardcoded in `textures.json`, along with bitmap names, rows, columns, and texture size.

## Self Hosting

> [Node.js](https://nodejs.org/en) needs to be installed.

This project is divided into two folders:

- **generator** (JSON compiler)
- **webpage** (GUI / Frontend)

To successfully compile the webpage, go through the steps in the [Generator](#generator) section before the [Webpage](#webpage) section.

### Generator

This part of the project generates a file in JSON format that contains:

- Glyph textures encoded in base64
- Glyph character representation
- Unicode character representation
- Glyph widths
- The bitmap where the given glyph is found
- The position of the glyph within the bitmap

#### JSON Generation

> Navigate to the `generator` folder, then install all required packages using `npm i`.

JavaScript is used to parse Minecraft bitmap textures. Using the providers in combination with them makes it possible to extract useful info. The exact implementation can be seen in `script.js`.

Because Minecraft assets fall under copyright, you'll have to provide them yourself. The files you'll need are:

- `accented.png`
- `ascii_sga.png`
- `ascii.png`
- `asciilager.png`
- `nonlatin_european.png`

These are automatically extracted from Minecraft's source code when running `script.js`. Simply provide the path to Minecraft's game folder (`.minecraft`) as such:

```sh
node .\script.js --path C:\Users\TheWilley\AppData\Roaming\.minecraft --name glyphs
```

This will result in a JSON file called `glyphs.json`. The name can be changed if desired.

#### Finding Textures Manually

If, for some reason, the script fails to find the textures, you can add them manually. The textures can be found within the `.jar` file of a Minecraft version. To find the `.jar`, navigate to Minecraft's game folder, then enter the **versions** folder. Within this folder, you should find more folders with versions in the format `x.x.x`, where `x` is a number.

![Minecraft Versions](readme/Screenshot%201.png)  
_Screenshot of Minecraft Versions_

In this case, `1.20.6` is the latest release. In this folder, you will find the `.jar` file with the same name as the folder. Open it using an archive manager, and follow this path: `assets > minecraft > textures > font`. In this folder, you'll find the aforementioned image files.

![Font Textures in 7zip](readme/Screenshot%202.png)  
_Screenshot of Font Textures in 7zip_

Move them to a folder called "textures" in the root directory of this part of the project (`generator`).

Lastly, add the `--skip` argument when running the script to skip automatic texture extraction.

```sh
node .\script.js --path C:\Users\TheWilley\AppData\Roaming\.minecraft --name glyphs --skip
```

### Webpage

This part of the project generates the webpage / GUI used to interact with the glyphs.

#### Webpage Generation

> Navigate to the `webpage` folder, then install all required packages using `npm i`.

First, follow the [JSON Generation](#json-generation) instructions to generate the required JSON file. Then follow these steps:

1. Move the generated JSON inside the public folder within the `webpage` folder.
2. Within the `.env` file of the aforementioned folder, change the `VITE_FILE` variable to the name of your JSON file (default is `glyphs.json`).
3. Run `npm run build` to build the webpage.
4. Run `npm run preview` to start the webpage on a server or upload to your own static host.
5. (Optional) `npm run dev` can be used to start the dev server.

## Disclaimer

Although the compiled webpage for this project includes copyrighted textures, I personally see no reason for Mojang / Microsoft to take it down because:

1. This project was made for educational purposes.
2. I make no money from this project.
3. This project will have no negative effect on Minecraft's trademark in any way, shape, or form.

Of course, I will take the webpage down if asked, respecting copyright as such, but I created this not with malicious intent, but to satisfy curiosity and to educate.

**This project is in no shape or form affiliated with or endorsed by Mojang and Microsoft.**

## License

MIT