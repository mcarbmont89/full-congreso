"use client"

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
}

export default function TinyMCEEditor({
  value,
  onChange,
  placeholder = "Escribe tu contenido aquí...",
  height = 400,
  readOnly = false
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);

  // Handle image upload integration with existing API
  const handleImageUpload = (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        formData.append('type', 'news');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          resolve(result.imageUrl);
        } else {
          reject('Error uploading image');
        }
      } catch (error) {
        reject('Error uploading image: ' + error);
      }
    });
  };

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="w-full">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key"}
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={readOnly}
        init={{
          height: height,
          menubar: false,
          language: 'es',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              margin: 1rem;
            }
            .two-column-layout {
              column-count: 2;
              column-gap: 2rem;
              column-rule: 1px solid #e5e7eb;
            }
            .image-container {
              position: relative;
              display: block;
              margin: 10px 0;
              max-width: 100%;
            }
          `,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'paste',
            'textpattern', 'nonbreaking', 'pagebreak', 'save', 'directionality', 'quickbars'
          ],
          toolbar: [
            'undo redo | blocks fontsize | bold italic underline strikethrough |',
            'alignleft aligncenter alignright alignjustify | outdent indent |',
            'numlist bullist | forecolor backcolor | link image media |',
            'table | customColumns | code preview fullscreen | help'
          ].join(' '),
          block_formats: 'Párrafo=p; Encabezado 1=h1; Encabezado 2=h2; Encabezado 3=h3; Encabezado 4=h4; Preformateado=pre',
          fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt',
          paste_as_text: false,
          paste_data_images: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          images_upload_handler: handleImageUpload,
          images_upload_url: '/api/upload',
          images_upload_base_path: '',
          image_advtab: true,
          image_description: false,
          image_dimensions: false,
          image_class_list: [
            { title: 'Imagen responsive', value: 'img-responsive' },
            { title: 'Imagen centrada', value: 'mx-auto block' },
            { title: 'Imagen flotante izquierda', value: 'float-left mr-4 mb-2' },
            { title: 'Imagen flotante derecha', value: 'float-right ml-4 mb-2' }
          ],
          table_responsive_width: true,
          table_default_attributes: {
            'class': 'table table-striped table-bordered'
          },
          link_default_target: '_blank',
          placeholder: placeholder,
          branding: false,
          promotion: false,
          setup: (editor: any) => {
            // Add custom button for two-column layout
            editor.ui.registry.addButton('columns', {
              text: '📰 Columnas',
              tooltip: 'Activar/Desactivar dos columnas',
              onAction: function() {
                const content = editor.getContent();
                if (content.includes('two-column-layout')) {
                  const newContent = content.replace(/class="[^"]*two-column-layout[^"]*"/g, '');
                  editor.setContent(newContent);
                } else {
                  editor.setContent(`<div class="two-column-layout">${content}</div>`);
                }
              }
            });

            // Add custom toolbar with columns button
            editor.on('init', function() {
              editor.ui.registry.addButton('customColumns', {
                text: '📰',
                tooltip: 'Activar/Desactivar dos columnas',
                onAction: function() {
                  const content = editor.getContent();
                  if (content.includes('two-column-layout')) {
                    const newContent = content.replace(/<div class="two-column-layout">([\s\S]*?)<\/div>/g, '$1');
                    editor.setContent(newContent);
                  } else {
                    editor.setContent(`<div class="two-column-layout">${content}</div>`);
                  }
                }
              });
            });
          },
          toolbar_mode: 'sliding',
          contextmenu: 'link image table',
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          quickbars_insert_toolbar: 'quickimage quicktable',
          content_css: false,
          skin: 'oxide',
          valid_elements: 'p,h1,h2,h3,h4,h5,h6,strong,em,u,s,a[href|target|title],img[src|alt|title|width|height|class],ul,ol,li,br,blockquote,table,thead,tbody,tr,th[scope],td[colspan|rowspan],span[class],div[class],pre,code',
          extended_valid_elements: 'div[class|style],span[class|style]',
          forced_root_block: 'p',
          force_p_newlines: true,
          remove_trailing_brs: true,
          convert_urls: false,
          relative_urls: false,
          entity_encoding: 'html'
        }}
      />
    </div>
  );
}