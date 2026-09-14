import type { Project } from './types'

export const rekordboxPlaylistConverter: Project = {
  slug: 'rekordbox-playlist-converter',
  name: 'Simple Rekordbox Converter',
  shortDescription:
    'Turn a Rekordbox playlist of lossless tracks into WAV or AIFF files without changing your originals.',
  description:
    'Simple Rekordbox Converter is a macOS app that reads a Rekordbox collection XML export, converts lossless playlist tracks to WAV or AIFF, and writes a new import XML. Cues, beatgrid, rating, BPM, and tags are copied into a playlist named after the original. It works with Rekordbox 6 and 7. Rekordbox is a trademark of AlphaTheta Corporation / Pioneer DJ; this unofficial tool is not affiliated with, endorsed by, or sponsored by AlphaTheta or Pioneer DJ.',
  benefits: [
    {
      title: 'Rekordbox 6 and 7',
      description:
        'Export the collection from either Rekordbox 6 or 7, convert, then load the generated XML from the rekordbox xml pane.',
    },
    {
      title: 'Originals stay untouched',
      description:
        'FLAC, ALAC, AIFF, and WAV sources are left where they are. The app writes copies into a separate output folder.',
    },
    {
      title: 'WAV or AIFF output',
      description:
        'Choose WAV or AIFF. Quality settings are a ceiling, not a target: 16-bit tracks stay 16-bit, and 44.1 kHz tracks stay 44.1 kHz.',
    },
    {
      title: 'Cues, beatgrid, and metadata preserved',
      description:
        'The generated playlist keeps cues, beatgrid, rating, BPM, and tags so you can import analysis instead of starting over.',
    },
  ],
  guide: {
    title: 'Convert a playlist in three steps',
    warning:
      'Do not use File → Import. Rekordbox must load this XML from the rekordbox xml pane via Imported Library.',
    steps: [
      {
        title: 'Export the Rekordbox collection XML',
        body:
          'In Rekordbox, wait until analysis has finished on the tracks you care about. Then use File → Export Collection in xml format and save the file locally. In Rekordbox 7, enable Preferences → Advanced → rekordbox xml → Export BeatGrid information so grids are included.',
      },
      {
        title: 'Convert with the macOS app',
        body:
          'Download Simple Rekordbox Converter from GitHub Releases, choose the collection XML, pick playlists, and convert. The app writes audio plus rekordbox-import.xml into the output folder. Convert shows a preview first; Back writes nothing.',
      },
      {
        title: 'Point Imported Library at the generated XML',
        body:
          'In Rekordbox, show the rekordbox xml pane (Preferences → View → Layout → Media Browser). Under Preferences → Advanced → Database → rekordbox xml, set Imported Library to the generated rekordbox-import.xml — not your original collection export. Open rekordbox xml → Playlists, then import the {playlist} [WAV] or {playlist} [AIFF] playlist into your library.',
      },
    ],
  },
  links: [
    {
      label: 'Source code on GitHub',
      href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter',
    },
    {
      label: 'Full usage documentation',
      href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/blob/master/USAGE.md',
    },
    {
      label: 'GitHub releases',
      href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
    },
  ],
  github: {
    owner: 'slnnzmtl',
    repo: 'rekordbox-playlist-converter',
  },
  seo: {
    title: 'Simple Rekordbox Converter',
    description:
      'Convert Rekordbox 6 and 7 playlists of lossless tracks to WAV or AIFF without changing originals. Cues, beatgrid, and metadata are preserved.',
  },
  softwareApplication: {
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'macOS',
    license: 'https://www.gnu.org/licenses/gpl-3.0.html',
  },
}
