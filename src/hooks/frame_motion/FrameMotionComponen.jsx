import { motion } from 'framer-motion'

/**
 * Presets de animación para AnimationComponent.
 * Cada preset define initial, animate y exit (variants de Framer Motion).
 *
 * Tipos disponibles:
 *
 * - fadeUp:   Entra desde abajo (y: 40 → 0), sale hacia arriba. Ideal para cards y bloques.
 * - fadeDown: Entra desde arriba (y: -40 → 0), sale hacia abajo. Útil para dropdowns.
 * - fadeIn:   Solo opacidad (0 → 1). Sutil, para overlays o mensajes.
 * - scale:    Aparece escalando (0.9 → 1), sale reduciendo. Bueno para modales y botones.
 * - slideLeft:  Entra desde la derecha (x: 40 → 0), sale a la izquierda. Paneles laterales.
 * - slideRight: Entra desde la izquierda (x: -40 → 0), sale a la derecha. Navegación.
 *
 * Uso: <AnimationComponent type="fadeUp" duration={0.5}>{children}</AnimationComponent>
 * Para animaciones custom, pasar la prop `variants` en lugar de `type`.
 */
const PRESETS = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
  },
}

const DEFAULT_TYPE = 'fadeUp'
const DEFAULT_DURATION = 0.4
const DEFAULT_DELAY = 0

/**
 * Envuelve contenido con una animación de Framer Motion.
 *
 * @param {string} type - Preset: 'fadeUp' | 'fadeDown' | 'fadeIn' | 'scale' | 'slideLeft' | 'slideRight'
 * @param {number} duration - Duración en segundos
 * @param {number} delay - Delay inicial en segundos
 * @param {object} variants - Reemplaza el preset (initial, animate, exit)
 * @param {object} transition - Objeto transition de Framer (override de duration/delay)
 * @param {string} className - Clases CSS para el wrapper
 * @param {string} as - Elemento: 'div' | 'span' | 'section' etc.
 */
export default function FrameMotionComponent({
  children,
  type = DEFAULT_TYPE,
  duration = DEFAULT_DURATION,
  delay = DEFAULT_DELAY,
  variants: customVariants,
  transition: customTransition,
  className,
  as = 'div',
  ...rest
}) {
  const preset = PRESETS[type] ?? PRESETS[DEFAULT_TYPE]
  const variants = customVariants ?? preset
  const transition = customTransition ?? { duration, delay }

  const MotionTag = motion[as]

  return (
    <MotionTag
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export { PRESETS }