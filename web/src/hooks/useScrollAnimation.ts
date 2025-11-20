import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.register(ScrollTrigger)

export function useScrollAnimation() {
  useEffect(() => {
    // Parallax effect for sections
    gsap.utils.toArray<HTMLElement>('section').forEach((section) => {
      gsap.to(section, {
        y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          invalidateOnRefresh: true,
          scrub: 0,
        },
      })
    })

    // Reveal animations for elements with data-reveal attribute
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    })

    // Fade in animations
    gsap.utils.toArray<HTMLElement>('[data-fade]').forEach((element) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])
}
