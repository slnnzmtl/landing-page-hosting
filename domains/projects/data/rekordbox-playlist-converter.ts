import type { Project } from './types'

export const rekordboxPlaylistConverter: Project = {
  slug: 'rekordbox-playlist-converter',
  name: 'Simple Rekordbox Converter',
  shortDescription:
    'Convert Rekordbox XML playlists and lossless tracks to WAV or AIFF without changing your original files.',
  description:
    'Simple Rekordbox Converter converts FLAC, ALAC, AIFF, and WAV tracks from Rekordbox 6 and 7 XML playlists into stereo PCM WAV or AIFF files. It generates new [WAV] or [AIFF] playlists for import back into Rekordbox while preserving the original audio files.\n\nThe project includes both an interactive Tkinter macOS application and a command-line interface for macOS, Linux, and Windows.',
  launch: {
    lead:
      'Convert Rekordbox XML playlists and lossless tracks to WAV or AIFF without changing your original files.',
    supportingLine:
      'Download the universal macOS app, or use the Python CLI on macOS, Windows, and Linux.',
    macosDownloadWarning:
      'On first open do right click -> open because the app is ad hoc signed',
    ctas: [
      {
        label: 'Download for macOS',
        href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
        kind: 'primary',
        macosDownload: true,
      },
      {
        label: 'Other platforms',
        href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
        kind: 'secondary',
      },
    ],
    trustFacts: [
      {
        label: 'macOS',
        value: '11 (Big Sur)+ · universal2',
      },
      {
        label: 'License',
        value: 'GNU GPL v3',
        href: 'https://www.gnu.org/licenses/gpl-3.0.html',
      },
      {
        label: 'Privacy',
        value: 'Optional; not required to convert',
      },
      {
        label: 'Issues',
        value: 'GitHub',
        href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/issues',
      },
    ],
    trademark:
      'Rekordbox is a trademark of AlphaTheta Corporation / Pioneer DJ. This unofficial tool is not affiliated with, endorsed by, or sponsored by AlphaTheta or Pioneer DJ.',
  },
  logo: {
    src: '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-logo.webp',
    srcThumb: '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-logo-256w.webp',
    srcset: '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-logo-256w.webp 256w, /projects/rekordbox-playlist-converter/simple-rekordbox-converter-logo.webp 512w',
    sizes: '(max-width: 1024px) 14rem, 14rem',
    alt: 'Simple Rekordbox Converter logo: a white circular arrow over concentric rings',
    width: 512,
    height: 512,
  },
  socialImage: {
    src: '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-social.webp',
    alt: 'Simple Rekordbox Converter logo on a dark background',
    width: 1200,
    height: 630,
  },
  benefits: [
    {
      title: 'Rekordbox 6 and 7 XML export/import workflow',
      description: 'Export a collection XML, convert playlists, then import the generated [WAV] or [AIFF] playlist through Imported Library.',
    },
    {
      title: 'WAV and AIFF output',
      description: 'Stereo PCM output with quality ceilings that never upsample beyond the source.',
    },
    {
      title: 'FLAC, ALAC, AIFF, and WAV input',
      description: 'Reads lossless sources from the Rekordbox XML without moving or overwriting originals.',
    },
    {
      title: 'Metadata support',
      description: 'Preserves cues, beatgrid, rating, BPM, and tags in the generated import XML.',
    },
    {
      title: '16/24-bit and 44.1/48 kHz quality ceilings',
      description: 'Bitrate and sample-rate settings cap output; sources below the ceiling stay unchanged.',
    },
    {
      title: 'No source-file modification',
      description: 'Converted audio is written to a separate output folder.',
    },
    {
      title: 'Dry-run and conversion preview modes',
      description: 'Review transcode, copy, and reuse decisions before anything is written.',
    },
    {
      title: 'Conflict detection and rerun handling',
      description: 'Skips or reuses existing outputs safely when you rerun a batch.',
    },
    {
      title: 'Universal Intel/Apple Silicon macOS app',
      description: 'Shipped as a universal2 macOS build with an interactive Tkinter UI.',
    },
    {
      title: 'GitHub Actions CI and automated tests',
      description: 'Release builds and unit tests run in CI before publication.',
    },
    {
      title: 'Optional anonymous analytics',
      description: 'Privacy-preserving usage analytics you can enable separately; not required to convert playlists.',
    },
  ],
  stackTags: [
    'Python',
    'Tkinter',
    'FFmpeg',
    'FFprobe',
    'PyInstaller',
    'macOS',
    'CLI',
    'Rekordbox XML',
    'GitHub Actions',
    'unittest',
  ],
  guide: {
    title: 'How to use',
    warning:
      'Do not use File → Import. Point Imported Library at the generated rekordbox-import.xml, then bring in the [WAV] or [AIFF] playlist from the rekordbox xml pane.',
    steps: [
      {
        title: 'Export from Rekordbox',
        body:
          'Wait until analysis has finished on the tracks you care about. Rekordbox 7: Preferences → Advanced → rekordbox xml → enable Export BeatGrid information. Then File → Export Collection in xml format and save locally (for example Documents/rekordbox). Avoid iCloud or Dropbox for a large export if you can.',
      },
      {
        title: 'Convert in the app',
        body:
          'Browse to the collection XML, pick playlists and tracks, confirm the output folder, choose WAV or AIFF and the quality ceilings, then Convert. Originals stay put. Import XML is always written as rekordbox-import.xml in that output folder.',
        image: {
          src: '/projects/rekordbox-playlist-converter/macos-app-main-window.webp',
          srcThumb: '/projects/rekordbox-playlist-converter/macos-app-main-window-600w.webp',
          srcset: '/projects/rekordbox-playlist-converter/macos-app-main-window-600w.webp 600w, /projects/rekordbox-playlist-converter/macos-app-main-window.webp 2240w',
          sizes: '(max-width: 1024px) 100vw, 56rem',
          alt: 'Simple Rekordbox Converter main window with a Rekordbox XML loaded, a playlist selected, and WAV output settings',
          width: 2240,
          height: 1440,
        },
      },
      {
        title: 'Confirm the preview',
        body:
          'Convert opens a preview first (action, reason, quality, size). Back writes nothing. Convert starts the batch. Conflicts — destination files changed outside this app — block Convert until you resolve them.',
        image: {
          src: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview.webp',
          srcThumb: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview-600w.webp',
          srcset: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview-600w.webp 600w, /projects/rekordbox-playlist-converter/macos-app-conversion-preview.webp 1920w',
          sizes: '(max-width: 1024px) 100vw, 56rem',
          alt: 'Conversion preview listing tracks as transcode, copy, or reuse with bit depth, sample rate, and size',
          width: 1920,
          height: 1080,
        },
      },
      {
        title: 'Import into Rekordbox',
        body:
          'Show the rekordbox xml pane (Preferences → View → Layout → Media Browser). Set Imported Library to rekordbox-import.xml — not the original collection export. Refresh if needed, then import the [WAV] or [AIFF] playlist from rekordbox xml → Playlists. Choose Yes if asked to load information from the library being imported.',
      },
      {
        title: 'Edit Import XML',
        body:
          'When a generated library already exists, Edit appears beside the Import XML path. Right-click tracks or playlists to Reveal in Finder, remove from playlist, or Move to Trash. Save commits the draft; Cancel discards it. Convert is locked while you are editing.',
        image: {
          src: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit.webp',
          srcThumb: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit-600w.webp',
          srcset: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit-600w.webp 600w, /projects/rekordbox-playlist-converter/macos-app-import-xml-edit.webp 1120w',
          sizes: '(max-width: 1024px) 100vw, 56rem',
          alt: 'Import XML edit mode with multi-select and a context menu for Reveal in Finder, Remove from playlist, and Move to Trash',
          width: 1120,
          height: 748,
        },
      },
    ],
  },
  github: {
    owner: 'slnnzmtl',
    repo: 'rekordbox-playlist-converter',
  },
  seo: {
    title: 'Simple Rekordbox Converter',
    titleSuffix: 'Daniel Kazansky',
    description:
      'Convert Rekordbox 6 and 7 XML playlists of FLAC, ALAC, AIFF, and WAV tracks to stereo PCM WAV or AIFF with a macOS app or cross-platform CLI.',
  },
  softwareApplication: {
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'macOS, Linux, Windows',
    license: 'https://www.gnu.org/licenses/gpl-3.0.html',
  },
}
