/**
 * Example Component - Using Color Constants
 * 
 * This file demonstrates best practices for using color constants in components.
 * Copy and adapt these patterns in your own components.
 */

'use client';

import React from 'react';
import { 
  PRIMARY, 
  BACKGROUND, 
  TEXT, 
  STATUS,
  TAILWIND_CLASSES,
  getButtonClass,
  getCardClass,
  getStatusColor,
  withOpacity 
} from '@/src/lib/colors';

// ============================================================================
// EXAMPLE 1: Card Component
// ============================================================================

export function ExampleCard() {
  return (
    <div className={getCardClass()}>
      <h2 className={TAILWIND_CLASSES.text.primary}>Card Title</h2>
      <p className={TAILWIND_CLASSES.text.secondary}>
        This card uses color constants for styling.
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Button Component
// ============================================================================

interface ExampleButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
}

export function ExampleButton({ 
  variant = 'primary', 
  children, 
  onClick 
}: ExampleButtonProps) {
  return (
    <button 
      className={getButtonClass(variant)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ============================================================================
// EXAMPLE 3: Status Badge Component
// ============================================================================

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info';
  label: string;
}

export function ExampleStatusBadge({ status, label }: StatusBadgeProps) {
  // Get color for inline style
  const statusColor = getStatusColor(status);
  
  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${TAILWIND_CLASSES.status[status]}
      `}
      style={{
        backgroundColor: withOpacity(statusColor, 10),
        borderColor: withOpacity(statusColor, 30),
      }}
    >
      {label}
    </span>
  );
}

// ============================================================================
// EXAMPLE 4: Input Component
// ============================================================================

interface ExampleInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function ExampleInput({ 
  placeholder = 'Enter text...', 
  value, 
  onChange 
}: ExampleInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        ${TAILWIND_CLASSES.input.base}
        ${TAILWIND_CLASSES.input.focus}
        ${TAILWIND_CLASSES.input.placeholder}
      `}
    />
  );
}

// ============================================================================
// EXAMPLE 5: Icon Background Component
// ============================================================================

interface ExampleIconProps {
  children: React.ReactNode;
  variant?: 'primary' | 'alternative';
}

export function ExampleIconBackground({ 
  children, 
  variant = 'primary' 
}: ExampleIconProps) {
  const bgClass = TAILWIND_CLASSES.iconBg[variant];
  
  return (
    <div className={`${bgClass} w-10 h-10 rounded-lg flex items-center justify-center`}>
      {children}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Progress Bar Component
// ============================================================================

interface ExampleProgressProps {
  percentage: number;
  label?: string;
}

export function ExampleProgress({ percentage, label }: ExampleProgressProps) {
  return (
    <div>
      {label && <p className={TAILWIND_CLASSES.text.secondary}>{label}</p>}
      <div className={`${TAILWIND_CLASSES.progress.bg} w-full h-2 rounded-full overflow-hidden`}>
        <div 
          className={`${TAILWIND_CLASSES.progress.bar} h-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Complex Component with Multiple Colors
// ============================================================================

interface ExampleAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export function ExampleAlert({ type, title, message }: ExampleAlertProps) {
  const backgroundColor = withOpacity(getStatusColor(type), 10);
  const borderColor = withOpacity(getStatusColor(type), 30);
  
  return (
    <div 
      className={`${getCardClass()} border-l-4`}
      style={{
        backgroundColor: BACKGROUND.glass,
        borderLeftColor: getStatusColor(type),
      }}
    >
      <h3 className={`font-semibold mb-1 ${TAILWIND_CLASSES.status[type]}`}>
        {title}
      </h3>
      <p className={TAILWIND_CLASSES.text.secondary}>
        {message}
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Component Using Direct Color Values
// ============================================================================

export function ExampleGradientBox() {
  return (
    <div 
      className="w-full h-32 rounded-lg flex items-center justify-center text-white font-semibold"
      style={{
        background: `linear-gradient(to right, ${PRIMARY.cyan}, ${PRIMARY.blue})`,
      }}
    >
      Gradient Box Using Color Constants
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Dark Mode Support (Pattern)
// ============================================================================

interface ExampleThemedComponentProps {
  isDark?: boolean;
  children: React.ReactNode;
}

export function ExampleThemedComponent({ isDark = true, children }: ExampleThemedComponentProps) {
  return (
    <div 
      style={{
        backgroundColor: isDark ? BACKGROUND.dark : '#FFFFFF',
        color: isDark ? TEXT.primary : '#000000',
      }}
      className="p-4 rounded-lg"
    >
      {children}
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Complete Page Section
// ============================================================================

export function ExamplePageSection() {
  return (
    <section style={{ backgroundColor: BACKGROUND.dark }} className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className={TAILWIND_CLASSES.text.primary}>
            Welcome to Our Dashboard
          </h1>
          <p className={TAILWIND_CLASSES.text.secondary}>
            This section demonstrates color constant usage throughout a page.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={getCardClass()}>
              <ExampleIconBackground>
                <div style={{ color: PRIMARY.cyan }}>📊</div>
              </ExampleIconBackground>
              <h3 className={`mt-4 ${TAILWIND_CLASSES.text.primary}`}>
                Card {i}
              </h3>
              <p className={`mt-2 ${TAILWIND_CLASSES.text.secondary}`}>
                Uses pre-built card classes and color constants.
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">
          <ExampleButton variant="primary">Primary Button</ExampleButton>
          <ExampleButton variant="secondary">Secondary Button</ExampleButton>
          <ExampleButton variant="ghost">Ghost Button</ExampleButton>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 mb-8">
          <ExampleStatusBadge status="success" label="Success" />
          <ExampleStatusBadge status="error" label="Error" />
          <ExampleStatusBadge status="warning" label="Warning" />
          <ExampleStatusBadge status="info" label="Info" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ExampleProgress percentage={65} label="Overall Progress" />
        </div>

        {/* Input */}
        <div className="mb-8">
          <ExampleInput 
            placeholder="Search something..." 
            value=""
            onChange={() => {}}
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BEST PRACTICES DEMONSTRATED
// ============================================================================

/**
 * KEY TAKEAWAYS:
 * 
 * 1. ✅ Import color constants at the top of the file
 * 2. ✅ Use pre-built Tailwind classes when available
 * 3. ✅ Use helper functions (getButtonClass, getCardClass, etc.)
 * 4. ✅ Use withOpacity() for dynamic opacity changes
 * 5. ✅ Use inline styles for complex gradient effects
 * 6. ✅ Keep components type-safe with TypeScript
 * 7. ✅ Document component props with JSDoc comments
 * 8. ✅ Extract magic strings into pre-built constants
 * 
 * DON'T:
 * ❌ Hardcode color hex values in components
 * ❌ Use magic numbers for opacity
 * ❌ Repeat the same color class string multiple times
 * ❌ Mix hardcoded colors with constants in the same file
 */

// ============================================================================
// TESTING YOUR COMPONENTS
// ============================================================================

/**
 * To test these examples:
 * 
 * 1. Create a new page:
 *    src/app/(app)/examples/page.tsx
 * 
 * 2. Import and use:
 *    import { ExamplePageSection } from '@/src/lib/example-components';
 *    
 *    export default function ExamplesPage() {
 *      return <ExamplePageSection />;
 *    }
 * 
 * 3. Navigate to /examples in your browser
 * 4. Verify colors match your design system
 */

// ============================================================================
// NEED HELP?
// ============================================================================

/**
 * Questions about color constants?
 * 
 * 1. Check COLOR_CONSTANTS_GUIDE.md for detailed documentation
 * 2. Review COLOR_REGISTRY.md for design system information
 * 3. Look at this file for usage examples
 * 4. Check COLOR_SYSTEM_OVERVIEW.md to understand the file structure
 */
