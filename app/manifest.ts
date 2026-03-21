import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Remes',
    short_name: 'Remes',
    description: 'AI-powered outbound sales that finds and converts high-intent leads',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f7f5',
    theme_color: '#6f42d6',
    icons: [
      {
        src: '/remes-logo.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
