/**
 * AI-Based Priority Engine — Rule-Based Classification Module
 * 
 * This module provides the core priority classification logic for complaints.
 * It is designed as a standalone, swappable service so that the rule-based
 * engine can be replaced with an AI/LLM model in the future without
 * modifying any consuming code.
 * 
 * Usage:
 *   import { calculatePriority } from '../services/priorityEngine';
 *   const result = calculatePriority(description, category);
 *   // result = { priority: "High", confidence: 94, matchedKeywords: ["electric wire"], source: "ai-rule-engine" }
 */

// ─── Priority Keyword Dictionaries ─────────────────────────────────────────────

const HIGH_PRIORITY_KEYWORDS = [
  // Electric & fire hazards
  'electric wire', 'exposed wire', 'live wire', 'electrocution', 'short circuit',
  'fire hazard', 'fire', 'burning', 'smoke',
  // Water emergencies
  'water pipeline burst', 'pipeline burst', 'water main break', 'sewage leak',
  'sewage overflow', 'contaminated water', 'water contamination',
  // Flooding
  'flooding', 'flood', 'waterlogging', 'water logging', 'submerged',
  // Structural dangers
  'bridge damage', 'bridge collapse', 'building collapse', 'wall collapse',
  'structural damage', 'crack in building', 'ceiling collapse',
  // Road safety
  'road accident', 'accident', 'vehicle collision', 'fatal',
  // Public safety threats
  'public safety threat', 'safety threat', 'safety hazard', 'danger to life',
  'life threatening', 'emergency', 'critical',
  // Open hazards
  'open manhole', 'manhole', 'sinkhole', 'cave in',
  'gas leak', 'chemical spill', 'toxic',
  // Drowning risk
  'drowning', 'deep water', 'unprotected well',
];

const MEDIUM_PRIORITY_KEYWORDS = [
  // Waste & sanitation
  'garbage', 'garbage accumulation', 'waste dump', 'litter', 'stench',
  'unhygienic', 'mosquito breeding', 'overflowing bin',
  // Road issues
  'pothole', 'potholes', 'road damage', 'road crack', 'broken road',
  'damaged road', 'uneven road', 'road repair',
  // Lighting
  'streetlight', 'street light', 'broken light', 'non functional light',
  'dark street', 'no light', 'lamp post',
  // Traffic
  'traffic signal', 'traffic light', 'signal malfunction', 'broken signal',
  'traffic jam', 'traffic congestion',
  // Sanitation facilities
  'public toilet', 'toilet maintenance', 'broken toilet', 'urinal',
  'washroom', 'sanitation',
  // Drainage
  'drain blockage', 'blocked drain', 'clogged drain', 'drainage',
  'water stagnation', 'standing water',
  // Footpath
  'damaged footpath', 'broken footpath', 'sidewalk damage', 'pavement',
];

const LOW_PRIORITY_KEYWORDS = [
  // Park & green spaces
  'park maintenance', 'park repair', 'park cleaning', 'playground',
  'garden maintenance', 'gardening',
  // Tree care
  'tree trimming', 'tree pruning', 'tree cutting', 'overgrown tree',
  'fallen leaves', 'tree branch',
  // Furniture/amenities
  'bench request', 'additional bench', 'bench repair', 'seating',
  'shade request', 'shelter',
  // Beautification
  'beautification', 'painting', 'whitewash', 'mural',
  'landscaping', 'flower bed', 'plantation',
  // General improvements
  'improvement suggestion', 'suggestion', 'feedback',
  'general improvement', 'enhancement', 'upgrade request',
  'signage', 'name board', 'direction board',
];

// Category-to-priority bias mapping
const CATEGORY_PRIORITY_HINTS = {
  'Roads & Highways': 'Medium',
  'Water Supply & Sanitation': 'Medium',
  'Electricity & Power': 'Medium',
  'Waste Management': 'Medium',
  'General Public Safety': 'Low',
};

// ─── Core Classification Function ──────────────────────────────────────────────

/**
 * Calculate the priority of a complaint based on its description and category.
 * 
 * @param {string} description - The complaint description text
 * @param {string} category - The complaint category
 * @returns {{ priority: string, confidence: number, matchedKeywords: string[], source: string }}
 */
export function calculatePriority(description = '', category = '') {
  const text = `${description} ${category}`.toLowerCase().trim();

  if (text.length < 3) {
    return {
      priority: 'Medium',
      confidence: 0,
      matchedKeywords: [],
      source: 'ai-rule-engine',
    };
  }

  // Scan all tiers
  const highMatches = HIGH_PRIORITY_KEYWORDS.filter(kw => text.includes(kw));
  const mediumMatches = MEDIUM_PRIORITY_KEYWORDS.filter(kw => text.includes(kw));
  const lowMatches = LOW_PRIORITY_KEYWORDS.filter(kw => text.includes(kw));

  // Determine priority by highest tier with matches
  let priority = 'Medium'; // default — never null
  let matchedKeywords = [];
  let confidence = 60; // baseline confidence

  if (highMatches.length > 0) {
    priority = 'High';
    matchedKeywords = highMatches;
    // Confidence scales with number of matched keywords (capped at 99)
    confidence = Math.min(99, 80 + highMatches.length * 5);
  } else if (mediumMatches.length > 0) {
    priority = 'Medium';
    matchedKeywords = mediumMatches;
    confidence = Math.min(95, 70 + mediumMatches.length * 5);
  } else if (lowMatches.length > 0) {
    priority = 'Low';
    matchedKeywords = lowMatches;
    confidence = Math.min(92, 72 + lowMatches.length * 5);
  } else {
    // No keyword matches — use category hint as fallback
    priority = CATEGORY_PRIORITY_HINTS[category] || 'Medium';
    matchedKeywords = [];
    confidence = 45; // low confidence when relying only on category
  }

  return {
    priority,
    confidence,
    matchedKeywords,
    source: 'ai-rule-engine',
  };
}

/**
 * Get the suggested category based on description text analysis.
 * 
 * @param {string} text - Combined title + description text
 * @returns {string} - Suggested category name
 */
export function suggestCategory(text = '') {
  const lower = text.toLowerCase();

  if (/pothole|road|highway|street damage|flyover|bridge/.test(lower)) {
    return 'Roads & Highways';
  }
  if (/water|contamination|leakage|sewage|drain|pipeline|manhole|sanitation/.test(lower)) {
    return 'Water Supply & Sanitation';
  }
  if (/streetlight|electricity|power|wire|electri|short circuit|transformer/.test(lower)) {
    return 'Electricity & Power';
  }
  if (/garbage|waste|dump|litter|stench|bin|trash|refuse/.test(lower)) {
    return 'Waste Management';
  }
  return 'General Public Safety';
}

/**
 * Get display configuration for a priority level.
 * 
 * @param {string} priority - "High" | "Medium" | "Low"
 * @returns {{ emoji: string, color: string, bgClass: string, textClass: string, borderClass: string }}
 */
export function getPriorityDisplay(priority) {
  switch (priority) {
    case 'High':
      return {
        emoji: '🔴',
        color: '#ef4444',
        bgClass: 'bg-red-50',
        textClass: 'text-red-700',
        borderClass: 'border-red-100',
        badgeClass: 'bg-red-50 text-red-700 border border-red-100',
        glowClass: 'shadow-red-100',
      };
    case 'Medium':
      return {
        emoji: '🟡',
        color: '#f59e0b',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-100',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
        glowClass: 'shadow-amber-100',
      };
    case 'Low':
      return {
        emoji: '🟢',
        color: '#10b981',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-100',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        glowClass: 'shadow-emerald-100',
      };
    default:
      return {
        emoji: '🟡',
        color: '#f59e0b',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-100',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
        glowClass: 'shadow-amber-100',
      };
  }
}

/**
 * Sort complaints by priority order: High → Medium → Low, then by date (newest first).
 * 
 * @param {Array} complaints - Array of complaint objects
 * @returns {Array} - Sorted array
 */
export function sortByPriority(complaints) {
  const order = { High: 0, Medium: 1, Low: 2 };
  return [...complaints].sort((a, b) => {
    const priorityDiff = (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
    if (priorityDiff !== 0) return priorityDiff;
    // Within same priority, sort by date (newest first)
    return new Date(b.date) - new Date(a.date);
  });
}
