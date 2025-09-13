"use client"

import React, { useState, useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe tu contenido aquí...",
  height = 400,
  readOnly = false
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);

    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }

    // Convert any existing standalone images to proper containers
    if (editorRef.current) {
      const existingImages = editorRef.current.querySelectorAll('img:not(.image-container img)');
      existingImages.forEach(img => {
        const container = document.createElement('div');
        container.className = 'image-container';
        // IMPORTANT: Initial styles for the container. Default to block for proper floating
        container.style.cssText = `
          position: relative;
          display: block; /* Make it a block element to allow float */
          margin: 10px 0;
          max-width: 100%;
        `;

        img.parentNode?.insertBefore(container, img);
        container.appendChild(img);

        // Add click handler
        img.addEventListener('click', (event) => handleImageClick(event as MouseEvent, img as HTMLImageElement, container));
      });
    }

    // Event listener for global clicks to deselect images
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.image-container') && !target.closest('.alignment-controls')) {
        deselectImage();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      // Clean up any remaining event listeners
      document.querySelectorAll('.image-controls').forEach(el => {
        const cleanup = cleanupFunctions.get(el as HTMLElement);
        if (cleanup) {
          cleanup();
          cleanupFunctions.delete(el as HTMLElement);
        }
      });
    };
  }, []);

  // Only update content when value prop changes from outside
  useEffect(() => {
    if (editorRef.current && mounted && value !== editorRef.current.innerHTML) {
      const selection = window.getSelection();
      let savedRange: Range | null = null;

      if (selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0);
      }

      editorRef.current.innerHTML = value;

      if (savedRange && editorRef.current.contains(savedRange.startContainer)) {
        try {
          selection?.removeAllRanges();
          selection?.addRange(savedRange);
        } catch (e) {
          editorRef.current.focus();
        }
      } else {
        editorRef.current.focus();
      }
    }
  }, [value, mounted]);

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'news');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.imageUrl;
      } else {
        console.error('Error uploading image');
        return '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
  };

  // Handle file input change
  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.indexOf('image') !== -1) {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl && editorRef.current) {
        insertImage(imageUrl, file.name);
      }
    }
    // Reset the input
    event.target.value = '';
  };

  // Insert image with default styling and controls
  const insertImage = (src: string, alt: string) => {
    if (!editorRef.current) return;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.cssText = `
      position: relative;
      display: block; /* Default to block */
      margin: 10px 0;
      max-width: 100%;
      clear: both; /* Ensure new images don't float beside previous ones by default */
    `;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
      width: 300px;
      height: auto;
      border-radius: 8px;
      cursor: pointer;
      max-width: 100%;
      vertical-align: middle; /* Prevents extra space below image */
    `;

    imageContainer.appendChild(img);

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        range.insertNode(imageContainer);
        // Place cursor after the inserted image container
        range.setStartAfter(imageContainer);
        range.setEndAfter(imageContainer);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current.appendChild(imageContainer);
      }
    } else {
      editorRef.current.appendChild(imageContainer);
    }

    setTimeout(() => {
      ensureCursorAtEnd();
    }, 0);

    img.addEventListener('click', (event) => handleImageClick(event, img, imageContainer));

    handleContentChange();
  };

  // Handle image click
  const handleImageClick = (event: MouseEvent, img: HTMLImageElement, container: HTMLDivElement) => {
    event.stopPropagation(); // Prevent global click handler from deselecting

    deselectImage(); // Deselect any previously selected image

    container.classList.add('image-selected');
    container.style.outline = '3px solid #3b82f6';
    container.style.outlineOffset = '2px';
    setSelectedImage(img);

    createResizeHandles(container, img);
    createAlignmentControls(container, img);
  };

  const deselectImage = () => {
    document.querySelectorAll('.image-selected').forEach(el => {
      el.classList.remove('image-selected');
      (el as HTMLElement).style.outline = '';
    });
    document.querySelectorAll('.image-controls').forEach(el => {
      // Clean up event listeners before removing element
      const cleanup = cleanupFunctions.get(el as HTMLElement);
      if (cleanup) {
        cleanup();
        cleanupFunctions.delete(el as HTMLElement);
      }
      el.remove();
    });
    setSelectedImage(null);
  };

  // Create resize handles
  // Store cleanup functions for event listeners
  const cleanupFunctions = new WeakMap<HTMLElement, () => void>();

  const createResizeHandles = (container: HTMLDivElement, img: HTMLImageElement) => {
    const handle = document.createElement('div');
    handle.className = 'image-controls resize-handle';
    handle.style.cssText = `
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 10px;
      height: 10px;
      background: #3b82f6;
      cursor: se-resize;
      border-radius: 2px;
      z-index: 1000;
    `;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = parseInt(img.style.width, 10) || img.offsetWidth;
      e.preventDefault();
      document.body.style.cursor = 'se-resize'; // Change cursor globally during resize
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const width = startWidth + e.clientX - startX;
      if (width > 50 && width <= 800) {
        img.style.width = width + 'px';
        img.style.height = 'auto';
      }
    };

    const onMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        handleContentChange();
        document.body.style.cursor = ''; // Reset cursor
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Store cleanup function
    const cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    cleanupFunctions.set(handle, cleanup);

    container.appendChild(handle);
  };

  // Create alignment controls
  const createAlignmentControls = (container: HTMLDivElement, img: HTMLImageElement) => {
    // Remove existing controls to avoid duplicates
    document.querySelectorAll('.image-controls.alignment-controls').forEach(el => el.remove());

    const controlsPanel = document.createElement('div');
    controlsPanel.className = 'image-controls alignment-controls';
    controlsPanel.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(12px);
      border: 3px solid #1e40af;
      border-radius: 12px;
      padding: 14px 16px;
      display: flex;
      gap: 10px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(30, 64, 175, 0.3), inset 0 1px 0 rgba(255,255,255,0.8);
      z-index: 999999;
      white-space: nowrap;
      outline: 2px solid rgba(255, 255, 255, 0.7);
      outline-offset: -1px;
      pointer-events: auto;
    `;

    // Size buttons with more prominent styling
    const sizes = [
      { label: 'S', width: '150px', title: 'Pequeño (150px)' },
      { label: 'M', width: '300px', title: 'Mediano (300px)' },
      { label: 'L', width: '500px', title: 'Grande (500px)' },
      { label: 'XL', width: '100%', title: 'Extra Grande (100%)' }
    ];

    sizes.forEach(size => {
      const btn = document.createElement('button');
      btn.textContent = size.label;
      btn.title = size.title;
      btn.setAttribute('type', 'button');
      btn.style.cssText = `
        padding: 10px 14px;
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 800;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(30, 64, 175, 0.4);
        transition: all 0.2s ease;
        min-width: 44px;
        position: relative;
        z-index: 100000;
      `;

      btn.addEventListener('mouseover', () => {
        btn.style.background = 'linear-gradient(135deg, #1d4ed8, #2563eb)';
        btn.style.transform = 'scale(1.05) translateY(-1px)';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      });

      btn.addEventListener('mouseout', () => {
        btn.style.background = 'linear-gradient(135deg, #1e40af, #3b82f6)';
        btn.style.transform = 'scale(1) translateY(0)';
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        img.style.width = size.width;
        img.style.height = 'auto';
        handleContentChange();
      });

      controlsPanel.appendChild(btn);
    });

    // Separator
    const separator = document.createElement('div');
    separator.style.cssText = 'width: 2px; background: linear-gradient(to bottom, transparent, #94a3b8, transparent); margin: 0 6px; border-radius: 1px;';
    controlsPanel.appendChild(separator);

    // Alignment buttons
    const alignments = [
      { label: '←', title: 'Alinear a la izquierda (texto rodea)', style: 'float: left; margin: 8px 16px 8px 0; display: block; clear: none;' },
      { label: '↔', title: 'Centrar (bloque)', style: 'margin: 15px auto; display: block; float: none; clear: both;' },
      { label: '→', title: 'Alinear a la derecha (texto rodea)', style: 'float: right; margin: 8px 0 8px 16px; display: block; clear: none;' }
    ];

    alignments.forEach(align => {
      const btn = document.createElement('button');
      btn.textContent = align.label;
      btn.title = align.title;
      btn.setAttribute('type', 'button');
      btn.style.cssText = `
        padding: 8px 12px;
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        border: 2px solid #64748b;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        box-shadow: 0 3px 6px rgba(0,0,0,0.15), 0 1px 3px rgba(100, 116, 139, 0.3);
        transition: all 0.2s ease;
        min-width: 40px;
        position: relative;
        z-index: 100000;
      `;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Reset all specific image alignment styles
        container.style.float = '';
        container.style.margin = '10px 0'; // Default margin
        container.style.display = 'block'; // Default display
        container.style.clear = 'both'; // Default clear

        // Apply new alignment styles
        const styles = align.style.split(';');
        styles.forEach(style => {
          const [property, value] = style.split(':').map(s => s.trim());
          if (property && value) {
            // Convert camelCase for JS style property access
            const jsProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            (container.style as any)[jsProperty] = value;
          }
        });
        handleContentChange();
      });
      controlsPanel.appendChild(btn);
    });

    // Column span button for two-column layouts
    const spanBtn = document.createElement('button');
    spanBtn.textContent = '📰';
    spanBtn.setAttribute('type', 'button');
    spanBtn.style.cssText = `
      padding: 8px 12px;
      background: linear-gradient(135deg, #e0f2fe, #bae6fd);
      border: 2px solid #0284c7;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      color: #0c4a6e;
      text-shadow: 0 1px 2px rgba(255,255,255,0.8);
      box-shadow: 0 3px 6px rgba(0,0,0,0.15), 0 1px 3px rgba(2, 132, 199, 0.3);
      transition: all 0.2s ease;
      margin-left: 8px;
      position: relative;
      z-index: 100000;
    `;
    spanBtn.title = 'Expandir a ancho completo (ignora columnas)';
    spanBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const hasSpan = container.classList.contains('column-span-full');
      if (hasSpan) {
        container.classList.remove('column-span-full');
        container.style.columnSpan = '';
      } else {
        container.classList.add('column-span-full');
        container.style.columnSpan = 'all';
      }
      handleContentChange();
    });
    controlsPanel.appendChild(spanBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.style.cssText = `
      padding: 8px 12px;
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      border: 2px solid #dc2626;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      color: #991b1b;
      text-shadow: 0 1px 2px rgba(255,255,255,0.8);
      box-shadow: 0 3px 6px rgba(0,0,0,0.15), 0 1px 3px rgba(220, 38, 38, 0.3);
      transition: all 0.2s ease;
      margin-left: 8px;
      position: relative;
      z-index: 100000;
    `;
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      container.remove();
      deselectImage();
      handleContentChange();
    });
    controlsPanel.appendChild(deleteBtn);

    document.body.appendChild(controlsPanel); // Append controls to body for fixed positioning
  };

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== value) {
        onChange(newContent);
      }
    }
  };

  // Fix cursor position after any DOM manipulation
  const ensureCursorAtEnd = () => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false); // Collapse to end

    selection.removeAllRanges();
    selection.addRange(range);

    editorRef.current.focus();
  };

  // Apply formatting (only for reliable execCommand operations)
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  // --- Using EXECCOMMAND for LISTS ---
  const toggleUnorderedList = () => {
    document.execCommand('insertUnorderedList', false, undefined);
    handleContentChange();
  };

  const toggleOrderedList = () => {
    document.execCommand('insertOrderedList', false, undefined);
    handleContentChange();
  };


  // Toggle two-column layout
  const toggleColumns = () => {
    if (editorRef.current) {
      const hasColumns = editorRef.current.classList.contains('two-column-layout');
      if (hasColumns) {
        editorRef.current.classList.remove('two-column-layout');
      } else {
        editorRef.current.classList.add('two-column-layout');
      }
      handleContentChange();
    }
  };

  // Handle paste to clean up formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleContentChange();
  };

  // Handle clicks inside editor to manage image selection
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // If a resize handle is being dragged, don't deselect
    if (target.classList.contains('resize-handle')) {
      return;
    }

    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      let container = img.closest('.image-container') as HTMLDivElement;

      if (!container) {
        // This case should ideally not happen if existing images are converted on mount
        // but it's a good fallback.
        container = document.createElement('div');
        container.className = 'image-container';
        container.style.cssText = `
          position: relative;
          display: block;
          margin: 10px 0;
          max-width: 100%;
        `;
        img.parentNode?.insertBefore(container, img);
        container.appendChild(img);
      }
      handleImageClick(e.nativeEvent, img, container); // Pass nativeEvent to handleImageClick
      return;
    }

    // If clicked anywhere else within the editor, deselect image
    if (!target.closest('.image-controls')) {
      deselectImage();
    }
  };


  if (!mounted) {
    return (
      <div className="w-full h-64 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
        <span className="text-gray-500">Cargando editor...</span>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Simple Toolbar - Only show when not read-only */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-200">
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => applyFormat('bold')}
            className="px-3 py-2 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Texto en negrita"
          >
            B
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => applyFormat('italic')}
            className="px-3 py-2 text-sm italic bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Texto en cursiva"
          >
            I
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => applyFormat('underline')}
            className="px-3 py-2 text-sm underline bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Texto subrayado"
          >
            U
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Text Size */}
          <select
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onChange={(e) => applyFormat('fontSize', e.target.value)}
            className="px-2 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="3"
          >
            <option value="1">Muy pequeño</option>
            <option value="2">Pequeño</option>
            <option value="3">Normal</option>
            <option value="4">Grande</option>
            <option value="5">Muy grande</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Column Layout */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => toggleColumns()}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Activar/Desactivar dos columnas"
          >
            📰 Columnas
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Align Left */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => applyFormat('justifyLeft')}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Alinear texto a la izquierda"
          >
            ←
          </button>

          {/* Align Center */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => applyFormat('justifyCenter')}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Centrar texto"
          >
            ↔
          </button>

          {/* Align Right */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => applyFormat('justifyRight')}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Alinear texto a la derecha"
          >
            →
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Bulleted List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={toggleUnorderedList}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Lista con viñetas"
          >
            • Lista
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={toggleOrderedList}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Lista numerada"
          >
            1. Lista
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Add Image */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents blur
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-sm bg-blue-600 text-white border border-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Agregar imagen"
          >
            📷 Imagen
          </button>

          {/* Hidden file input - Only show when not read-only */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Help Text */}
      <div className="px-3 py-2 bg-blue-50 border-b border-blue-200 text-xs text-blue-700">
        💡 **¡Súper fácil!** Usa el botón "Columnas" para crear artículos como periódicos. Las imágenes se pueden mover a izquierda/derecha para que el texto las rodee.
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onPaste={handlePaste}
        onClick={handleEditorClick}
        onInput={handleContentChange}
        style={{ minHeight: `${height}px`, direction: 'ltr', textAlign: 'left' }}
        className={`p-4 focus:outline-none text-gray-900 leading-relaxed ${readOnly ? 'cursor-default' : ''}`}
        suppressContentEditableWarning={true}
        dir="ltr"
      >
      </div>

      {/* Footer Help */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        ✨ Activa "Columnas" para crear artículos como periódicos. Haz clic en imágenes para cambiar tamaño y posición. ¡Como en un periódico real!
      </div>

      {/* Global styles for the editor content */}
      <style jsx>{`
        /* Styles for the two-column layout */
        .two-column-layout {
          column-count: 2;
          column-gap: 40px; /* Space between columns */
          /* Ensures floats inside don't break the column layout */
          clear: both;
        }

        /* Ensure images and other elements can span across all columns */
        .two-column-layout .image-container.column-span-full {
          column-span: all;
        }

        /* Clearfix for the editor content itself to handle floats */
        .p-4::after {
          content: "";
          display: table;
          clear: both;
        }

        /* Basic styling for lists in contentEditable */
        .p-4 ul, .p-4 ol {
            /* Forzar el margen izquierdo para que las viñetas sean visibles */
            margin-left: 2.5em !important; 
            padding-left: 0 !important; /* Asegurarse de que no haya padding que lo empuje */
            list-style-position: outside !important; /* Crucial: Asegurarse de que la viñeta/número esté fuera del contenido del item */
            margin-bottom: 1em !important; /* Espacio debajo de la lista */
            /* Quita el padding-inline-start de ul/ol si estuviera afectando */
            -webkit-padding-start: 0 !important;
        }
        .p-4 ul {
            list-style-type: disc !important; /* Tipo de viñeta por defecto */
        }
        .p-4 ol {
            list-style-type: decimal !important; /* Tipo de numeración por defecto */
        }
        .p-4 li {
            /* Muy importante: asegurar que se renderice como un item de lista para que el list-style funcione */
            display: list-item !important;
            margin-bottom: 4px !important; /* Espacio entre items de la lista */
            padding-left: 0 !important; /* Resetear cualquier padding del item */
            /* Ayuda visual para depuración: Comentar estas líneas si no funcionan las viñetas */
            /* border: 1px dashed red !important; 
            padding: 2px !important; */
        }

        /* Default block for editor children for better consistency */
        .p-4 > *:not(.image-container, ul, ol) { /* Excluye listas para no afectar sus márgenes */
          margin-bottom: 1em; /* Add some spacing between paragraphs/blocks */
        }
      `}</style>
    </div>
  );
}