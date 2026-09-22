import React from 'react';
import { X, Compass } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export default function SafeCircleMapModal({
  isOpen,
  onClose,
  userLocation,
  homeLocation,
  safeRadius = 500,
  distanceFromHome,
  status,
}) {
  const { t, isHindi } = useI18n();

  if (!isOpen) return null;

  const isSafe = status === 'SAFE';
  const isApproaching = status === 'APPROACHING';

  // Coordinate offsets for visual SVG representation
  // Center is Home (200, 200).
  // 500m radius is represented as a circle of radius 110px.
  // Map scale: 110px = 500m => 0.22 px per meter.
  const pixelRadius = 110;
  const userDistanceRatio = Math.min(distanceFromHome / safeRadius, 1.8);
  const userOffsetDistance = pixelRadius * userDistanceRatio;

  // Render user position offset (simulate slight angle towards north-east)
  const angleRad = Math.PI / 4; // 45 degrees
  const userX = 200 + userOffsetDistance * Math.cos(angleRad);
  const userY = 200 - userOffsetDistance * Math.sin(angleRad);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#102A43]/75 backdrop-blur-sm animate-slow-fade text-left"
    >
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-5 sm:p-8 border-4 border-[#DFF3E7] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#DFF3E7] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7EF] border-2 border-[#167A55]/30 flex items-center justify-center text-2xl shrink-0">
              🛡️
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#102A43]">
                SafeCircle {t('safeZone')} {t('viewLocation')}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#5D7184]">
                {homeLocation?.address || (isHindi ? '12-B, हजरतगंज, लखनऊ' : '12-B, Hazratganj, Lucknow')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FBFAF4] hover:bg-slate-100 text-[#5D7184] hover:text-[#102A43] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={t('voiceClose')}
            title={t('voiceClose')}
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Status Indicator Banner */}
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-3 flex-wrap ${
            isSafe
              ? 'bg-[#EAF7EF] border-[#167A55]/30 text-[#167A55]'
              : isApproaching
              ? 'bg-[#FFF0D7] border-[#E98A20]/40 text-[#E98A20]'
              : 'bg-[#FFE8EF] border-[#E84D78]/50 text-[#E84D78]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{isSafe ? '🟢' : isApproaching ? '🟠' : '🔴'}</span>
            <div>
              <span className="text-lg font-black block leading-tight">
                {isSafe
                  ? t('insideSafeZone')
                  : isApproaching
                  ? t('approachingBoundary')
                  : t('safeZoneAlertDesc')}
              </span>
              <span className="text-xs sm:text-sm font-bold opacity-90">
                {t('distanceFromHome', { dist: distanceFromHome })}
              </span>
            </div>
          </div>

          {userLocation?.isDemo && (
            <span className="px-2.5 py-1 rounded-full bg-white/90 font-black text-xs uppercase tracking-wider border border-current">
              {t('demoLocationLabel')}
            </span>
          )}
        </div>

        {/* Clean SVG Geofence & Location Map Display */}
        <div className="relative bg-[#FBFAF4] rounded-3xl border-3 border-[#DFF3E7] p-2 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full max-w-[360px] h-[320px] sm:h-[360px] select-none">
            {/* Background Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#grid)" />

            {/* City Landmark Roads (Stylized Lucknow layout) */}
            <path d="M 0 200 Q 200 180 400 200" stroke="#CBD5E1" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d="M 200 0 Q 180 200 200 400" stroke="#CBD5E1" strokeWidth="14" fill="none" strokeLinecap="round" />

            {/* Safe Zone Boundary Circle (500m) */}
            <circle
              cx="200"
              cy="200"
              r={pixelRadius}
              fill={isSafe ? '#167A55' : isApproaching ? '#E98A20' : '#E84D78'}
              fillOpacity="0.12"
              stroke={isSafe ? '#167A55' : isApproaching ? '#E98A20' : '#E84D78'}
              strokeWidth="3"
              strokeDasharray="6 6"
            />

            {/* Safe Zone Boundary Label */}
            <text x="200" y={200 - pixelRadius - 8} textAnchor="middle" fill="#167A55" fontSize="11" fontWeight="bold">
              {isHindi ? `सुरक्षित दायरा: ${safeRadius} मीटर` : `Safe Radius: ${safeRadius}m`}
            </text>

            {/* Home Marker in Center */}
            <g transform="translate(185, 182)">
              <circle cx="15" cy="18" r="18" fill="#167A55" />
              <text x="15" y="24" textAnchor="middle" fill="white" fontSize="16">🏠</text>
            </g>
            <text x="200" y="226" textAnchor="middle" fill="#102A43" fontSize="12" fontWeight="black">
              {isHindi ? 'घर (Home)' : 'Home'}
            </text>

            {/* Connecting line between Home and User */}
            <line
              x1="200"
              y1="200"
              x2={userX}
              y2={userY}
              stroke={isSafe ? '#167A55' : '#E84D78'}
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* User Marker */}
            <g transform={`translate(${userX - 15}, ${userY - 15})`}>
              <circle cx="15" cy="15" r="20" fill={isSafe ? '#167A55' : '#E84D78'} opacity="0.2" className="animate-ping" />
              <circle cx="15" cy="15" r="14" fill={isSafe ? '#167A55' : '#E84D78'} />
              <text x="15" y="20" textAnchor="middle" fill="white" fontSize="13">👴</text>
            </g>
            <text
              x={userX}
              y={userY - 20}
              textAnchor="middle"
              fill={isSafe ? '#167A55' : '#E84D78'}
              fontSize="11"
              fontWeight="black"
              className="bg-white"
            >
              {isHindi ? `आप (${distanceFromHome}m)` : `You (${distanceFromHome}m)`}
            </text>
          </svg>

          {/* Compass Rose Widget in corner */}
          <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-2xl border border-[#DFF3E7] shadow-xs flex items-center gap-1 text-xs font-bold text-[#5D7184]">
            <Compass className="w-4 h-4 text-[#167A55]" aria-hidden="true" />
            <span>{isHindi ? 'उत्तर (N)' : 'North (N)'}</span>
          </div>
        </div>

        {/* Location Coordinates & Privacy Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-[#5D7184]">
          <div className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#E2E8F0]">
            <span className="font-black text-[#102A43] block">{isHindi ? 'वर्तमान पता:' : 'Current Location:'}</span>
            <p className="mt-0.5">{userLocation?.address}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FBFAF4] border border-[#E2E8F0]">
            <span className="font-black text-[#102A43] block">{isHindi ? 'गोपनीयता सूचना:' : 'Privacy Notice:'}</span>
            <p className="mt-0.5">
              {isHindi
                ? 'स्थान केवल अधिकृत देखभालकर्ता के साथ साझा किया जाता है।'
                : 'Location is shared only with your authorized family caregiver.'}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="tactile-btn w-full py-3.5 rounded-2xl bg-[#167A55] text-white font-black text-lg cursor-pointer shadow-sm hover:bg-[#115C40]"
        >
          {t('voiceClose')}
        </button>
      </div>
    </div>
  );
}
