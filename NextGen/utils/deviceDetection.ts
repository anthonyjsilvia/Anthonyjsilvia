/**
 * Device Detection Utilities
 * Comprehensive iOS, iPadOS, and device detection
 */

/**
 * Detects if the device is running iOS (including iPhone, iPad, iPod)
 * Uses multiple detection methods for reliability
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = window.navigator.platform?.toLowerCase() || ''
  
  // Check userAgent for iOS indicators
  const hasIOSUserAgent = 
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes('mac') && 'ontouchend' in document)
  
  // Check platform for iOS indicators
  const hasIOSPlatform = 
    /iphone|ipad|ipod/.test(platform) ||
    platform === 'macintel' && 'ontouchend' in document
  
  // Check for iOS-specific features
  const hasIOSFeatures = 
    'ontouchend' in document &&
    !(window as any).MSStream &&
    !(window as any).chrome
  
  // Check for iPadOS (iPad running iOS 13+)
  const isIPadOS = 
    /macintosh/.test(userAgent) &&
    'ontouchend' in document &&
    navigator.maxTouchPoints > 1
  
  return hasIOSUserAgent || hasIOSPlatform || hasIOSFeatures || isIPadOS
}

/**
 * Detects if the device is an iPhone specifically
 */
export function isIPhone(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone/.test(userAgent) && !/ipad/.test(userAgent)
}

/**
 * Detects if the device is an iPad specifically (including iPadOS)
 */
export function isIPad(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isIPadUserAgent = /ipad/.test(userAgent)
  
  // iPadOS detection (iPad running iOS 13+ reports as Mac)
  const isIPadOS = 
    /macintosh/.test(userAgent) &&
    'ontouchend' in document &&
    navigator.maxTouchPoints > 1 &&
    !(window as any).MSStream
  
  return isIPadUserAgent || isIPadOS
}

/**
 * Detects if the device is an iPod Touch
 */
export function isIPod(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /ipod/.test(userAgent)
}

/**
 * Gets the iOS version number if available
 */
export function getIOSVersion(): number | null {
  if (typeof window === 'undefined' || !isIOS()) return null
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  const match = userAgent.match(/os (\d+)[_\d]*/i)
  
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }
  
  return null
}

/**
 * Detects if running on iOS Safari specifically
 */
export function isIOSSafari(): boolean {
  if (typeof window === 'undefined' || !isIOS()) return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent)
}

/**
 * Detects if running on iOS Chrome
 */
export function isIOSChrome(): boolean {
  if (typeof window === 'undefined' || !isIOS()) return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /crios|chrome/.test(userAgent)
}

/**
 * Detects if running on iOS Firefox
 */
export function isIOSFirefox(): boolean {
  if (typeof window === 'undefined' || !isIOS()) return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /fxios/.test(userAgent)
}

/**
 * Detects if the device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

/**
 * Detects if running on macOS (including iPadOS detection)
 */
export function isMacOS(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = window.navigator.platform?.toLowerCase() || ''
  
  // Exclude iPadOS (which reports as Mac)
  if (isIPad()) return false
  
  return /mac/.test(platform) || /macintosh/.test(userAgent)
}

/**
 * Detects if running on Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /android/.test(userAgent)
}

/**
 * Detects if running on Windows
 */
export function isWindows(): boolean {
  if (typeof window === 'undefined') return false
  
  const platform = window.navigator.platform?.toLowerCase() || ''
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  return /win/.test(platform) || /windows/.test(userAgent)
}

/**
 * Gets comprehensive device information
 */
export function getDeviceInfo() {
  return {
    isIOS: isIOS(),
    isIPhone: isIPhone(),
    isIPad: isIPad(),
    isIPod: isIPod(),
    iosVersion: getIOSVersion(),
    isIOSSafari: isIOSSafari(),
    isIOSChrome: isIOSChrome(),
    isIOSFirefox: isIOSFirefox(),
    isTouchDevice: isTouchDevice(),
    isMacOS: isMacOS(),
    isAndroid: isAndroid(),
    isWindows: isWindows(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    platform: typeof window !== 'undefined' ? window.navigator.platform : '',
  }
}

