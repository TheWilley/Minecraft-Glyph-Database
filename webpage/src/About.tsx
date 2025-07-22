import ascii_sga_texture from './assets/ascii_sga_texture.png';
import ascii_sga_provider from './assets/ascii_sga_provider.png';

function About() {
  return (
    <div className='w-full p-6 sm:p-8 lg:p-10 text-left'>
      <div>
        {/* Page Title */}
        <h1 className='text-3xl sm:text-4xl font-bold text-primary mb-6'>
          What is this?
        </h1>

        {/* Introduction Section */}
        <section className='mb-8'>
          <p className='text-lg leading-relaxed mb-4'>
            Minecraft's Java Edition uses a somewhat unique font rendering system. Unlike
            traditional applications that might rely on system fonts, Minecraft bundles
            its own set of font textures and mechanisms to display text within the game
            world, menus, and chat. This page will briefly explain this system and how
            Minecraft Glyph Database (MGD) is built upon it. The information presented
            here is sourced from Minecraft's internal files and the{' '}
            <a className='link' href='https://minecraft.wiki/w/Font'>
              Minecraft Wiki
            </a>
            .
          </p>
        </section>

        {/* How Do Fonts Work Section */}
        <section className='mb-8'>
          <h2 className='text-2xl sm:text-3xl font-semibold text-primary mb-4'>
            How do fonts work?
          </h2>

          <p className='text-lg leading-relaxed mt-4'>
            Directly quoting the Minecraft Wiki, "A font is constructed from a list of
            providers, sources that provide characters to use. Different providers use
            different formats and methods of constructing characters." These
            aforementioned "sources" are JSON files which reside in the{' '}
            <code className='bg-base-300 px-1 rounded'>/assets/minecraft/font</code>{' '}
            subfolder of any Minecraft Version's JAR file. One of these providers in
            particular, the "Bitmap provider," references PNG files that contain glyphs
            for said font in a grid-like arrangement—i.e., a bitmap. This provider also
            consists of a list of glyphs that correspond one-to-one with the grid
            positions in the texture bitmap, matching the layout both horizontally and
            vertically.
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 mb-3'>
              <img
                src={ascii_sga_provider}
                className=''
                style={{ imageRendering: 'auto' }}
                width={600}
                height={200}
                alt='A JSON file displaying the Minecraft Provider which contains "ascii_sga"'
              />
              <img
                src={ascii_sga_texture}
                width={500}
                height={200}
                alt='A image of the "ascii_sga" texture'
              />
            </div>
            The <code className='bg-base-300 px-1 rounded'>\u0000</code> character
            represent{' '}
            <a href='https://www.unicode.org/charts/PDF/U0000.pdf' className='link'>
              NULL in Unicode
            </a>{' '}
            , effectively used as padding in this instance. In the images above, you can
            see how the characters match up with the glyphs on the texture, which is key
            as this allows us to extrapolate glyph-character pairs. Specifically, we
            leverage the ordered list of characters in the provider and the structured
            nature of the bitmap. For each character defined in the provider, its position
            within that list directly corresponds to a specific cell in the bitmap's grid.
            Knowing the bitmap's overall dimensions and the implicitly defined size of
            each character cell (derived from the width, height, and a calculation based
            on the total number of characters and texture size), we can precisely
            calculate the pixel coordinates and the bounding box for that glyph. This
            enables us to 'cut out' or extract the exact pixel data for a given glyph from
            its specific region within the texture's boundaries.
          </p>
        </section>

        {/* What Fonts Are Included Section */}
        <section className='mt-8'>
          <h2 className='text-2xl sm:text-3xl font-semibold text-primary mb-4'>
            What fonts are included?
          </h2>
          <p className='text-lg leading-relaxed mt-4'>
            <p className='text-lg leading-relaxed mb-4'>
              By default, Java Edition has four fonts, but only three are in this database
              (marked with an asterisk):
            </p>
            <ul className='list-disc list-inside text-lg leading-relaxed space-y-2 pl-4 mb-2'>
              <li>
                <strong className='text-primary'>default*</strong>
              </li>
              <li>
                <strong className='text-primary'>alt*</strong>
              </li>
              <li>
                <strong className='text-primary'>uniform</strong>
              </li>
              <li>
                <strong className='text-primary'>illageralt*</strong>
              </li>
            </ul>{' '}
            The <code className='bg-base-300 px-1 rounded'>uniform</code> font is the
            exception because it acts as a fallback, referencing a ZIP file containing a
            copy of GNU Unifont, which isn't unique to Minecraft. The <i>included</i>{' '}
            aforementioned fonts reference a total of five bitmap textures:
          </p>
          <table className='table mt-5 mb-5 text-lg leading-relaxed border-collapse'>
            <thead>
              <tr>
                <th className='text-left px-4 py-2'>Filename</th>
                <th className='text-left px-4 py-2'>Font</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>accented.png</code>
                </td>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>default</code>
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>nonlatin_european.png</code>
                </td>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>default</code>
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>ascii.png</code>
                </td>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>default</code>
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>ascii_sga.png</code>
                </td>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>alt</code>
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>asciilager.png</code>
                </td>
                <td className='px-4 py-2'>
                  <code className='bg-base-300 px-1 rounded'>illageralt</code>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default About;
