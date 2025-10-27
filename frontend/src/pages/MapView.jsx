import { motion } from 'framer-motion'
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet'

const MapView = () => {
  // Basemap configuration (XYZ or WMS)
  const basemapType = (import.meta.env.VITE_BASEMAP_TYPE || 'XYZ').toUpperCase()
  const basemapUrl = import.meta.env.VITE_BASEMAP_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const basemapAttribution = import.meta.env.VITE_BASEMAP_ATTRIBUTION || '&copy; OpenStreetMap contributors'
  const wmsLayers = import.meta.env.VITE_WMS_LAYERS || ''
  const wmsFormat = import.meta.env.VITE_WMS_FORMAT || 'image/png'
  const wmsTransparent = (import.meta.env.VITE_WMS_TRANSPARENT || 'true') === 'true'
  const wmsStyles = import.meta.env.VITE_WMS_STYLES || ''
  const wmsVersion = import.meta.env.VITE_WMS_VERSION || '1.3.0'

  const shouldFallbackToXYZ = basemapType === 'WMS' && !wmsLayers

  // Debug log to help diagnose blank layers
  // eslint-disable-next-line no-console
  console.log('[Map] Basemap config', { basemapType, basemapUrl, wmsLayers, wmsFormat, wmsTransparent, wmsStyles, wmsVersion })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-dark-100 mb-2">
          Plantation Map
        </h1>
        <p className="text-neutral-600 dark:text-dark-400">
          Basemap view
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-0 overflow-hidden relative"
          >
            <div className="h-96">
              <MapContainer
                center={[7.4863, 80.3647]} // Kurunegala coordinates
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                {basemapType === 'WMS' && !shouldFallbackToXYZ ? (
                  <WMSTileLayer
                    url={basemapUrl}
                    layers={wmsLayers}
                    styles={wmsStyles}
                    format={wmsFormat}
                    transparent={wmsTransparent}
                    version={wmsVersion}
                    tiled
                    attribution={basemapAttribution}
                  />
                ) : (
                  <TileLayer url={basemapUrl} attribution={basemapAttribution} />
                )}
              </MapContainer>
            </div>

            {shouldFallbackToXYZ && (
              <div className="absolute left-4 bottom-4 z-[1000] bg-yellow-100 text-yellow-900 border border-yellow-300 rounded px-3 py-2 text-xs shadow">
                WMS is selected but no layer configured. Showing XYZ fallback. Set VITE_WMS_LAYERS in your env.
              </div>
            )}
          </motion.div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
                Basemap Only
              </h3>
              <p className="text-sm text-neutral-600">
                Zones have been removed. The map displays the configured basemap layer.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
                Layer Info
              </h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <p><strong>Type:</strong> {shouldFallbackToXYZ ? 'XYZ (fallback)' : basemapType}</p>
                <p className="break-all"><strong>URL:</strong> {basemapUrl}</p>
                {basemapType === 'WMS' && (
                  <>
                    <p><strong>WMS Layers:</strong> {wmsLayers || '(not set)'}</p>
                    <p><strong>WMS Version:</strong> {wmsVersion}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MapView
