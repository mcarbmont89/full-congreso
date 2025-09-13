import { NextResponse, NextRequest } from 'next/server'

const radioConfig: {
  streamUrl: string;
  heroImage: string;
  channels: Array<{
    id: string;
    name: string;
    color: string;
    img: string;
    active: boolean;
  }>;
  navigation: Array<{
    name: string;
    href: string;
  }>;
  categoryImages: Record<string, string>;
  carousel: Array<{
    id: string;
    title: string;
    image: string;
    link: string;
  }>;
} = {
  streamUrl: "https://ccstreaming.packet.mx/LiveApp/streams/Radio_kd5oiNTTWO0gEOFc23dr762145.m3u8",
  heroImage: "/images/radio-hero-banner.png",
  channels: [
    {
      id: "radio-congreso",
      name: "Radio Congreso",
      color: "#7e22ce",
      img: "/images/radio-congreso-logo.png",
      active: true
    },
    {
      id: "canal-45-1",
      name: "CANAL 45.1",
      color: "#4a4a4a",
      img: "/images/channel-c-logo.png",
      active: false
    },
    {
      id: "canal-45-2",
      name: "CANAL 45.2",
      color: "#b91c1c",
      img: "/images/channel-g-logo.png",
      active: false
    },
    {
      id: "canal-45-3",
      name: "CANAL 45.3",
      color: "#15803d",
      img: "/images/channel-d-logo.png",
      active: false
    }
  ],
  navigation: [
    { name: "Toma Tribuna", href: "/radio/toma-tribuna" },
    { name: "Entrevistas", href: "/radio/entrevistas" },
    { name: "Sitio Abierto", href: "/radio/sitio-abierto" },
    { name: "Noticias del Congreso", href: "/radio/noticias-congreso" }
  ],
  categoryImages: {},
  carousel: []
}

export async function GET() {
  try {
    console.log('Config API: Fetching radio config')

    // Fetch navigation from database
    let navigationItems = radioConfig.navigation
    try {
      const navResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/radio/navigation`)
      if (navResponse.ok) {
        const dbNavigation = await navResponse.json()
        navigationItems = dbNavigation.map((item: any) => ({
          name: item.name,
          href: item.href
        }))
        console.log('Config API: Using database navigation:', navigationItems)
      }
    } catch (navError) {
      console.warn('Config API: Could not fetch navigation from database, using default:', navError)
    }

    const configWithDynamicNav = {
      ...radioConfig,
      navigation: navigationItems
    }

    console.log('Config API: Returning response:', configWithDynamicNav)
    return NextResponse.json(configWithDynamicNav)
  } catch (error) {
    console.error('Config API: Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()

    console.log('Config API: Updating configuration with:', updates)

    // Update the config object with new values
    if (updates.streamUrl) {
      radioConfig.streamUrl = updates.streamUrl
    }

    if (updates.heroImage) {
      radioConfig.heroImage = updates.heroImage
    }

    if (updates.categoryImages) {
      radioConfig.categoryImages = {
        ...radioConfig.categoryImages,
        ...updates.categoryImages
      }
    }

    if (updates.channels) {
      radioConfig.channels = updates.channels
    }

    if (updates.navigation) {
      radioConfig.navigation = updates.navigation
    }

    // Rebuild carousel with updated images
    if (updates.categoryImages) {
      if (!radioConfig.carousel) {
        radioConfig.carousel = []
      }
      radioConfig.carousel = Object.keys(radioConfig.categoryImages).map(categoryName => ({
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        title: categoryName.toUpperCase(),
        image: radioConfig.categoryImages[categoryName as keyof typeof radioConfig.categoryImages],
        link: `/radio/${categoryName.toLowerCase().replace(/\s+/g, '-')}`
      }))
    }

    console.log('Config API: Updated configuration:', radioConfig)

    return NextResponse.json(radioConfig)
  } catch (error) {
    console.error('Config API: Error updating config:', error)
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    )
  }
}