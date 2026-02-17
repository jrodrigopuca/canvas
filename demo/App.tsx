import { useState, useRef, useCallback } from 'react';
import {
  Canvas,
  CanvasRef,
  CanvasElement,
  Theme,
  lightTheme,
  darkTheme,
  createRectangle,
  createEllipse,
  createDiamond,
  createText,
  createLine,
  createActor,
  createLifeline,
  createMessage,
  createActivationBar,
  serializeToJSON,
  downloadAsFile,
  ImageFormat,
} from '../src';

type TabType = 'shapes' | 'uml' | 'theme' | 'export';

// Dark blue theme
const blueTheme: Theme = {
  ...darkTheme,
  name: 'blue',
  colors: {
    ...darkTheme.colors,
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    element: {
      fill: '#1e293b',
      stroke: '#3b82f6',
      hover: '#334155',
      active: '#475569',
    },
    selection: {
      fill: 'rgba(59, 130, 246, 0.15)',
      stroke: '#3b82f6',
    },
  },
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('shapes');

  return (
    <div className="demo-app">
      <header className="demo-header">
        <h1>@jrodrigopuca/canvas</h1>
        <p>Interactive SVG canvas library for React</p>
      </header>

      <nav className="demo-tabs">
        <button
          className={`demo-tab ${activeTab === 'shapes' ? 'active' : ''}`}
          onClick={() => setActiveTab('shapes')}
        >
          Shapes
        </button>
        <button
          className={`demo-tab ${activeTab === 'uml' ? 'active' : ''}`}
          onClick={() => setActiveTab('uml')}
        >
          UML Diagram
        </button>
        <button
          className={`demo-tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          Themes
        </button>
        <button
          className={`demo-tab ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Export
        </button>
      </nav>

      <main className="demo-content">
        {activeTab === 'shapes' && <ShapesDemo />}
        {activeTab === 'uml' && <UMLDemo />}
        {activeTab === 'theme' && <ThemeDemo />}
        {activeTab === 'export' && <ExportDemo />}
      </main>
    </div>
  );
}

// Shapes Demo
function ShapesDemo() {
  const canvasRef = useRef<CanvasRef>(null);
  const [elementCount, setElementCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);

  const addShape = (type: 'rectangle' | 'ellipse' | 'diamond' | 'text' | 'actor' | 'lifeline' | 'message' | 'activationBar') => {
    const x = 50 + Math.random() * 500;
    const y = 50 + Math.random() * 300;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    let element: CanvasElement;
    switch (type) {
      case 'rectangle':
        element = createRectangle({
          x,
          y,
          width: 100 + Math.random() * 50,
          height: 60 + Math.random() * 30,
          style: { fill: color, stroke: color },
        });
        break;
      case 'ellipse':
        element = createEllipse({
          x,
          y,
          width: 80 + Math.random() * 40,
          height: 60 + Math.random() * 30,
          style: { fill: color, stroke: color },
        });
        break;
      case 'diamond':
        element = createDiamond({
          x,
          y,
          width: 80,
          height: 80,
          style: { fill: color, stroke: color },
        });
        break;
      case 'text':
        element = createText({
          x,
          y,
          text: 'Text Label',
          fontSize: 16,
        });
        break;
      case 'actor':
        element = createActor({
          x,
          y,
          width: 60,
          height: 100,
          label: 'Actor',
        });
        break;
      case 'lifeline':
        element = createLifeline({
          x,
          y,
          width: 100,
          height: 200,
          label: 'Lifeline',
        });
        break;
      case 'message':
        element = createMessage({
          x,
          y,
          width: 150,
          height: 30,
          label: 'message()',
          messageType: 'sync',
        });
        break;
      case 'activationBar':
        element = createActivationBar({
          x,
          y,
          width: 12,
          height: 80,
        });
        break;
    }

    canvasRef.current?.addElement(element);
  };

  const addLine = () => {
    const startX = 50 + Math.random() * 300;
    const startY = 100 + Math.random() * 250;
    // Create horizontal line by default
    const element = createLine({
      points: [
        { x: startX, y: startY },
        { x: startX + 150, y: startY },
      ],
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    });
    canvasRef.current?.addElement(element);
  };

  const handleDelete = () => {
    const ids = canvasRef.current?.getSelectedIds() ?? [];
    ids.forEach((id) => canvasRef.current?.removeElement(id));
  };

  const handleUndo = () => canvasRef.current?.undo();
  const handleRedo = () => canvasRef.current?.redo();

  const handleChange = useCallback((elements: CanvasElement[]) => {
    setElementCount(elements.length);
  }, []);

  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedCount(ids.length);
  }, []);

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>All Elements</h2>
        <div className="demo-toolbar">
          <div className="demo-toolbar-group">
            <span className="demo-toolbar-label">Shapes:</span>
            <button className="demo-btn primary" onClick={() => addShape('rectangle')}>
              Rectangle
            </button>
            <button className="demo-btn primary" onClick={() => addShape('ellipse')}>
              Ellipse
            </button>
            <button className="demo-btn primary" onClick={() => addShape('diamond')}>
              Diamond
            </button>
            <button className="demo-btn primary" onClick={() => addShape('text')}>
              Text
            </button>
            <button className="demo-btn primary" onClick={addLine}>
              Line
            </button>
          </div>
          <div className="demo-toolbar-group">
            <span className="demo-toolbar-label">UML:</span>
            <button className="demo-btn primary" onClick={() => addShape('actor')}>
              Actor
            </button>
            <button className="demo-btn primary" onClick={() => addShape('lifeline')}>
              Lifeline
            </button>
            <button className="demo-btn primary" onClick={() => addShape('message')}>
              Message
            </button>
            <button className="demo-btn primary" onClick={() => addShape('activationBar')}>
              ActivationBar
            </button>
          </div>
          <div className="demo-toolbar-group">
            <button className="demo-btn" onClick={handleUndo}>
              ↶ Undo
            </button>
            <button className="demo-btn" onClick={handleRedo}>
              ↷ Redo
            </button>
          </div>
          <div className="demo-toolbar-group">
            <button
              className="demo-btn danger"
              onClick={handleDelete}
              disabled={selectedCount === 0}
            >
              Delete Selected
            </button>
          </div>
        </div>
      </div>

      <div className="demo-canvas-container">
        <Canvas
          ref={canvasRef}
          width={800}
          height={450}
          showGrid
          gridSize={20}
          onChange={handleChange}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <div className="demo-status-bar">
        <div className="demo-status-item">
          Elements: <strong>{elementCount}</strong>
        </div>
        <div className="demo-status-item">
          Selected: <strong>{selectedCount}</strong>
        </div>
        <div className="demo-status-item">
          <kbd>Ctrl+Z</kbd> Undo
        </div>
        <div className="demo-status-item">
          <kbd>Delete</kbd> Remove
        </div>
        <div className="demo-status-item">
          <kbd>Shift+Click</kbd> Multi-select
        </div>
      </div>
    </div>
  );
}

// UML Demo
function UMLDemo() {
  const initialElements: CanvasElement[] = [
    // Lifelines
    createLifeline({
      id: 'client',
      x: 80,
      y: 30,
      width: 100,
      height: 380,
      label: 'Client',
    }),
    createLifeline({
      id: 'api',
      x: 280,
      y: 30,
      width: 100,
      height: 380,
      label: 'API Server',
    }),
    createLifeline({
      id: 'db',
      x: 480,
      y: 30,
      width: 100,
      height: 380,
      label: 'Database',
    }),

    // Activation bars
    createActivationBar({
      id: 'act-api',
      x: 325,
      y: 100,
      width: 10,
      height: 200,
    }),
    createActivationBar({
      id: 'act-db',
      x: 525,
      y: 150,
      width: 10,
      height: 80,
    }),

    // Messages
    createMessage({
      id: 'msg1',
      x: 130,
      y: 100,
      width: 195,
      height: 20,
      label: 'POST /api/users',
      messageType: 'sync',
    }),
    createMessage({
      id: 'msg2',
      x: 335,
      y: 150,
      width: 190,
      height: 20,
      label: 'INSERT user',
      messageType: 'sync',
    }),
    createMessage({
      id: 'msg3',
      x: 335,
      y: 210,
      width: 190,
      height: 20,
      label: 'user_id',
      messageType: 'return',
    }),
    createMessage({
      id: 'msg4',
      x: 130,
      y: 280,
      width: 195,
      height: 20,
      label: '201 Created',
      messageType: 'return',
    }),
  ];

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>UML Sequence Diagram</h2>
        <div className="demo-info" style={{ margin: 0, flex: 1, marginLeft: '1rem' }}>
          Drag elements to reposition. This shows a typical REST API interaction.
        </div>
      </div>

      <div className="demo-canvas-container">
        <Canvas
          width={680}
          height={450}
          defaultElements={initialElements}
          showGrid={false}
        />
      </div>

      <div className="demo-uml-info">
        <div className="demo-uml-legend">
          <h4>Elements</h4>
          <ul>
            <li>Lifeline - Represents an object or participant</li>
            <li>Activation Bar - Shows when an object is active</li>
            <li>Message (sync) - Synchronous call with solid arrow</li>
            <li>Message (return) - Return value with dashed line</li>
          </ul>
        </div>
        <div className="demo-uml-legend">
          <h4>Keyboard Shortcuts</h4>
          <ul>
            <li><kbd>Ctrl+Z</kbd> - Undo</li>
            <li><kbd>Ctrl+Shift+Z</kbd> - Redo</li>
            <li><kbd>Delete</kbd> - Remove selected</li>
            <li><kbd>Escape</kbd> - Deselect all</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Theme Demo
function ThemeDemo() {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [themeName, setThemeName] = useState<'light' | 'dark' | 'blue'>('light');

  const handleThemeChange = (name: 'light' | 'dark' | 'blue') => {
    setThemeName(name);
    switch (name) {
      case 'light':
        setTheme(lightTheme);
        break;
      case 'dark':
        setTheme(darkTheme);
        break;
      case 'blue':
        setTheme(blueTheme);
        break;
    }
  };

  const demoElements: CanvasElement[] = [
    createRectangle({
      id: 'rect1',
      x: 50,
      y: 80,
      width: 140,
      height: 90,
    }),
    createEllipse({
      id: 'ellipse1',
      x: 250,
      y: 90,
      width: 120,
      height: 80,
    }),
    createDiamond({
      id: 'diamond1',
      x: 440,
      y: 70,
      width: 100,
      height: 100,
    }),
    createText({
      id: 'text1',
      x: 200,
      y: 220,
      text: 'Theme Preview',
      fontSize: 20,
    }),
    createLine({
      id: 'line1',
      points: [
        { x: 100, y: 280 },
        { x: 500, y: 280 },
        { x: 500, y: 350 },
      ],
    }),
  ];

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Theming</h2>
        <div className="demo-theme-selector">
          <button
            className={`demo-theme-btn light ${themeName === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}
            title="Light Theme"
          />
          <button
            className={`demo-theme-btn dark ${themeName === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
            title="Dark Theme"
          />
          <button
            className={`demo-theme-btn blue ${themeName === 'blue' ? 'active' : ''}`}
            onClick={() => handleThemeChange('blue')}
            title="Blue Theme"
          />
        </div>
      </div>

      <div className="demo-canvas-container">
        <Canvas
          width={680}
          height={400}
          theme={theme}
          defaultElements={demoElements}
          showGrid
          gridSize={20}
        />
      </div>

      <div className="demo-status-bar">
        <div className="demo-status-item">
          Current Theme: <strong>{theme.name}</strong>
        </div>
        <div className="demo-status-item">
          Background: <strong>{theme.colors.background}</strong>
        </div>
        <div className="demo-status-item">
          Element Stroke: <strong>{theme.colors.element.stroke}</strong>
        </div>
      </div>
    </div>
  );
}

// Export Demo
function ExportDemo() {
  const canvasRef = useRef<CanvasRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportData, setExportData] = useState<string>('');
  const [exportType, setExportType] = useState<'json' | 'svg' | 'png' | 'jpeg'>('json');
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const demoElements: CanvasElement[] = [
    createRectangle({
      id: 'box',
      x: 150,
      y: 100,
      width: 120,
      height: 80,
      style: { fill: '#3b82f6', stroke: '#1d4ed8' },
    }),
    createEllipse({
      id: 'circle',
      x: 350,
      y: 100,
      width: 100,
      height: 100,
      style: { fill: '#10b981', stroke: '#059669' },
    }),
    createText({
      id: 'label',
      x: 200,
      y: 250,
      text: 'Export Example',
      fontSize: 18,
    }),
  ];

  const handleExportJSON = () => {
    const data = canvasRef.current?.toJSON();
    if (data) {
      const json = serializeToJSON(data.elements, data.connections);
      setExportData(json);
      setExportType('json');
      setImageBlob(null);
    }
  };

  const handleExportSVG = () => {
    const svg = canvasRef.current?.toSVG();
    if (svg) {
      setExportData(svg);
      setExportType('svg');
      setImageBlob(null);
    }
  };

  const handleExportImage = async (format: ImageFormat) => {
    setIsExporting(true);
    try {
      const blob = await canvasRef.current?.toImage({
        format,
        quality: 0.92,
        backgroundColor: format === 'jpeg' ? '#ffffff' : undefined,
      });
      if (blob) {
        setImageBlob(blob);
        setExportType(format);
        setExportData(`Image exported: ${(blob.size / 1024).toFixed(2)} KB`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export image');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (exportType === 'png' || exportType === 'jpeg') {
      if (!imageBlob) return;
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `canvas-export.${exportType === 'jpeg' ? 'jpg' : 'png'}`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (exportData) {
      if (exportType === 'json') {
        downloadAsFile(exportData, 'canvas-export.json', 'application/json');
      } else {
        downloadAsFile(exportData, 'canvas-export.svg', 'image/svg+xml');
      }
    }
  };

  const handleCopy = async () => {
    if (exportType === 'png' || exportType === 'jpeg') {
      if (imageBlob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [imageBlob.type]: imageBlob })
          ]);
          alert('Image copied to clipboard!');
        } catch {
          alert('Failed to copy image. Try downloading instead.');
        }
      }
    } else if (exportData) {
      await navigator.clipboard.writeText(exportData);
      alert('Copied to clipboard!');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      try {
        canvasRef.current?.fromJSON(json);
        setExportData('');
        setImageBlob(null);
        alert('Import successful!');
      } catch (error) {
        console.error('Import error:', error);
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="demo-section">
      <div className="demo-section-header">
        <h2>Export & Import</h2>
        <div className="demo-toolbar">
          <div className="demo-toolbar-group">
            <button className="demo-btn primary" onClick={handleExportJSON}>
              JSON
            </button>
            <button className="demo-btn primary" onClick={handleExportSVG}>
              SVG
            </button>
            <button 
              className="demo-btn primary" 
              onClick={() => handleExportImage('png')}
              disabled={isExporting}
            >
              PNG
            </button>
            <button 
              className="demo-btn primary" 
              onClick={() => handleExportImage('jpeg')}
              disabled={isExporting}
            >
              JPEG
            </button>
          </div>
          <div className="demo-toolbar-group">
            <button 
              className="demo-btn" 
              onClick={handleDownload} 
              disabled={!exportData && !imageBlob}
            >
              Download
            </button>
            <button 
              className="demo-btn" 
              onClick={handleCopy} 
              disabled={!exportData && !imageBlob}
            >
              Copy
            </button>
            <button className="demo-btn" onClick={handleImportClick}>
              Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileImport}
            />
          </div>
        </div>
      </div>

      <div className="demo-row">
        <div className="demo-col">
          <div className="demo-canvas-container">
            <Canvas
              ref={canvasRef}
              width={500}
              height={350}
              defaultElements={demoElements}
              showGrid
              gridSize={20}
            />
          </div>
        </div>

        <div className="demo-col">
          <div style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              {exportType === 'json' ? 'JSON Output' : 
               exportType === 'svg' ? 'SVG Output' : 
               `${exportType.toUpperCase()} Image`}
            </h3>
            <div className="demo-export-preview">
              {(exportType === 'png' || exportType === 'jpeg') && imageBlob ? (
                <img 
                  src={URL.createObjectURL(imageBlob)} 
                  alt="Canvas export"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              ) : (
                exportData || 'Click an export button to preview output'
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-status-bar">
        <div className="demo-status-item">
          Format: <strong>{exportType.toUpperCase()}</strong>
        </div>
        <div className="demo-status-item">
          Size: <strong>
            {imageBlob 
              ? `${(imageBlob.size / 1024).toFixed(2)} KB`
              : exportData 
                ? `${(exportData.length / 1024).toFixed(2)} KB` 
                : '-'}
          </strong>
        </div>
        {isExporting && (
          <div className="demo-status-item">
            <em>Exporting...</em>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
