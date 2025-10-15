import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function POST() {
  try {
    const transparencySections = [
      {
        sectionKey: 'informacion-utilidad',
        sectionTitle: 'INFORMACIÓN DE UTILIDAD PÚBLICA',
        iconType: 'document',
        displayOrder: 1,
        cardsData: [
          {
            title: 'DEFENSOR DE AUDIENCIAS',
            description: 'El Defensor de Audiencias es el ombudsman del Canal del Congreso encargado de recibir, analizar y dar seguimiento de las solicitudes, dudas, quejas y sugerencias del público respecto a la programación, contenidos y servicios.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'AUTONOMÍA TÉCNICA Y DE GESTIÓN',
            description: 'El Canal del Congreso es el medio de comunicación especializado en información del Poder Legislativo que tiene autonomía técnica y de gestión, para garantizar su independencia y una perspectiva objetiva.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'ADQUISICIONES',
            description: 'Es política del Canal del Congreso dar a conocer las adquisiciones y arrendamientos de bienes y servicios autorizados para publicación por la Comisión Bicameral del Canal de Televisión del Congreso General de los Estados Unidos Mexicanos.',
            linkUrl: '#',
            hasButton: true
          }
        ]
      },
      {
        sectionKey: 'estructura-presupuesto',
        sectionTitle: 'ESTRUCTURA Y PRESUPUESTO',
        iconType: 'building',
        displayOrder: 2,
        cardsData: [
          {
            title: 'PRESUPUESTO',
            description: 'Información sobre el presupuesto asignado y ejercido por el Canal del Congreso.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'DIRECTORIO',
            description: 'Listado del personal de mando superior y mandos medios del Canal.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'ORGANIGRAMA',
            description: 'Organigrama de las áreas que conforman el Canal del Congreso.',
            linkUrl: '#',
            hasButton: true
          }
        ]
      },
      {
        sectionKey: 'normatividad',
        sectionTitle: 'NORMATIVIDAD',
        iconType: 'scale',
        displayOrder: 3,
        cardsData: [
          {
            title: 'NORMATIVIDAD GENERAL',
            description: 'Constitución, Ley Federal de Telecomunicaciones, Ley Federal de Transparencia y Acceso a la Información, Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados, y Ley Federal de Archivos.',
            hasButton: false
          },
          {
            title: 'NORMATIVIDAD INTERNA',
            description: 'Ley Orgánica del Congreso, Reglamento del Canal, Políticas de Comunicación, Guía de Usuario, Código de Ética, Lineamientos de la Defensoría de Audiencia, Reglas de Funcionamiento del Consejo Consultivo, Lineamientos Generales de Administración, entre otros.',
            hasButton: false
          }
        ]
      },
      {
        sectionKey: 'compromisos-transparencia',
        sectionTitle: 'COMPROMISOS CON LA TRANSPARENCIA',
        iconType: 'message',
        displayOrder: 4,
        cardsData: [
          {
            title: 'ÓRGANO RECTOR',
            description: 'El Canal del Congreso está regido por una comisión legislativa integrada de manera plural por representantes de la Cámara de Senadores y de la Cámara de Diputados, denominada "Comisión Bicameral del Canal de Televisión del Congreso.',
            hasButton: false
          },
          {
            title: 'CONSEJO CONSULTIVO',
            description: 'El Canal del Congreso cuenta con un Consejo Consultivo, conformado por once especialistas con amplia trayectoria y reconocimiento en el ámbito de los medios de comunicación, propuestos por instituciones académicas, organizaciones civiles y otras.',
            hasButton: false
          }
        ]
      },
      {
        sectionKey: 'transparencia-focalizada',
        sectionTitle: 'TRANSPARENCIA FOCALIZADA',
        iconType: 'book',
        displayOrder: 5,
        cardsData: [
          {
            title: 'NUEVAS PRODUCCIONES',
            description: 'El Canal del Congreso ha ampliado su oferta de programación y diversificado sus contenidos, a través de nuevos espacios de información y análisis del acontecer nacional e internacional, que contribuyen a generar una sociedad mejor informada.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'ACCESIBILIDAD',
            description: 'Comprometidos con la inclusión de diversos sectores de la sociedad a los contenidos del Canal del Congreso, se incorporó desde diciembre de 2015 la interpretación a Lengua de Señas Mexicanas de las sesiones de ambas Cámaras del Congreso de la Unión, así como el noticiero nocturno de este medio de comunicación.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'ENCUESTAS DE OPINIÓN PÚBLICA',
            description: 'Entre sus políticas de vinculación con la audiencia, el Canal del Congreso realiza estudios de opinión para conocer los perfiles, comportamientos, necesidades e inquietudes de la ciudadanía con respecto a la comunicación parlamentaria y a la función social del propio Canal.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'REPORTES DE COMUNICACIÓN DE LA AUDIENCIA',
            description: 'Entre sus políticas de vinculación con la audiencia, el Canal del Congreso busca generar mayor interacción y dar atención a las comunicaciones que recibe a través del Sistema Escríbenos y redes sociales.',
            linkUrl: '#',
            hasButton: true
          }
        ]
      },
      {
        sectionKey: 'datos-abiertos',
        sectionTitle: 'DATOS ABIERTOS',
        iconType: 'database',
        displayOrder: 6,
        cardsData: [
          {
            title: 'INFORME DE ACTIVIDADES',
            description: '',
            items: [
              { label: 'Actividades 2021' },
              { label: 'Actividades 2020' },
              { label: 'Actividades 2019' },
              { label: 'Actividades 2018' },
              { label: 'Actividades 2017' },
              { label: 'Actividades 2016' },
              { label: 'Actividades 2015' }
            ],
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'INFORMES TRIMESTRALES',
            description: '',
            items: [
              { label: 'Informe 2021' },
              { label: 'Informe 2020' },
              { label: 'Informe 2019' },
              { label: 'Informe 2018' },
              { label: 'Informe 2017' },
              { label: 'Informe 2016' },
              { label: 'Informe 2015' }
            ],
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'PROGRAMA ANUAL DE TRABAJO',
            description: '',
            items: [
              { label: 'Programa 2021' },
              { label: 'Programa 2020' },
              { label: 'Programa 2019' },
              { label: 'Programa 2018' },
              { label: 'Programa 2017' },
              { label: 'Programa 2016' },
              { label: 'Programa 2015' }
            ],
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'BITÁCORAS DE TRANSMISIÓN EN SEÑAL ABIERTA',
            description: '',
            items: [
              { label: 'Bitácoras 2021' },
              { label: 'Bitácoras 2020' },
              { label: 'Bitácoras 2019' },
              { label: 'Bitácoras 2018' },
              { label: 'Bitácoras 2017' },
              { label: 'Bitácoras 2016' },
              { label: 'Bitácoras 2015' }
            ],
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'BASE DE DATOS DE ACERVO VIDEOGRÁFICO',
            description: '',
            items: [
              { label: 'Acervo videográfico 2022' },
              { label: 'Acervo videográfico 2021' },
              { label: 'Acervo videográfico 2020' },
              { label: 'Acervo videográfico 2019' },
              { label: 'Acervo videográfico 2018' },
              { label: 'Acervo videográfico 2017' },
              { label: 'Acervo videográfico 2016' },
              { label: 'Acervo videográfico 2015' }
            ],
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'ESTADÍSTICAS DE PLATAFORMAS DIGITALES DEL CANAL',
            description: '',
            items: [
              { label: 'Estadísticas 2021' },
              { label: 'Estadísticas 2020' },
              { label: 'Estadísticas 2019' },
              { label: 'Estadísticas 2018' },
              { label: 'Estadísticas 2017' },
              { label: 'Estadísticas 2016' },
              { label: 'Estadísticas 2015' }
            ],
            linkUrl: '#',
            hasButton: true
          }
        ]
      },
      {
        sectionKey: 'acerca-nosotros',
        sectionTitle: 'ACERCA DE NOSOTROS',
        iconType: 'info',
        displayOrder: 7,
        cardsData: [
          {
            title: 'MISIÓN',
            description: 'Difundir las actividades del Poder Legislativo de la Unión, ofrecer información objetiva, veraz y oportuna.',
            hasButton: false
          },
          {
            title: 'VISIÓN',
            description: 'Consolidarnos como el medio de comunicación legislativo más plural de América Latina.',
            hasButton: false
          },
          {
            title: 'VALORES',
            description: 'Objetividad, Pluralidad, Imparcialidad, Veracidad, Oportunidad, Calidad.',
            hasButton: false
          },
          {
            title: 'HISTORIA',
            description: 'El Canal del Congreso inició transmisiones el 11 de octubre de 2000.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'COBERTURA',
            description: 'El Canal del Congreso tiene cobertura nacional a través de sistemas de cable, satélite, IPTV e Internet.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'SEÑAL EN VIVO',
            description: 'Transmisión en vivo 24/7 del Canal del Congreso.',
            linkUrl: '#',
            hasButton: true
          },
          {
            title: 'PROGRAMACIÓN',
            description: 'Consulta la programación semanal del Canal del Congreso.',
            linkUrl: '#',
            hasButton: true
          }
        ]
      }
    ]

    // Insert all sections
    for (const section of transparencySections) {
      await query(`
        INSERT INTO transparency_sections (section_key, section_title, icon_type, cards_data, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (section_key) DO UPDATE SET
          section_title = EXCLUDED.section_title,
          icon_type = EXCLUDED.icon_type,
          cards_data = EXCLUDED.cards_data,
          display_order = EXCLUDED.display_order,
          updated_at = CURRENT_TIMESTAMP
      `, [
        section.sectionKey,
        section.sectionTitle,
        section.iconType,
        JSON.stringify(section.cardsData),
        section.displayOrder,
        true
      ])
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Transparency sections seeded successfully',
      count: transparencySections.length
    })
  } catch (error) {
    console.error('Error seeding transparency sections:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed transparency sections' 
    }, { status: 500 })
  }
}
