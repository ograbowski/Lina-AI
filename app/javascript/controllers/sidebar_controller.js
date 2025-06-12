import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "sidebar", "panel", "closeBtn", "mainContent", "openBtn" ]

    initialize() {
        this.isOpen = false
        this.sidebarWidth = 224 // w-56 = 224px
    }

    connect() {
        this.handleKeyDown = this.handleKeyDown.bind(this)
        document.addEventListener('keydown', this.handleKeyDown)

        // Wyłącz wszystkie animacje na początku
        this.disableAnimations()

        // Ustaw stan natychmiastowo bez animacji
        this.initializeSidebarStateImmediately()

        // Po krótkim timeout włącz animacje z powrotem
        setTimeout(() => {
            this.enableAnimations()
        }, 50)

        // Nasłuchuj na Turbo events
        document.addEventListener('turbo:load', () => {
            this.disableAnimations()
            this.initializeSidebarStateImmediately()
            setTimeout(() => {
                this.enableAnimations()
            }, 50)
        })

        document.addEventListener('turbo:render', () => {
            this.disableAnimations()
            this.initializeSidebarStateImmediately()
            setTimeout(() => {
                this.enableAnimations()
            }, 50)
        })
    }

    disconnect() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    disableAnimations() {
        // Wyłącz animacje dla wszystkich elementów
        if (this.hasMainContentTarget) {
            this.mainContentTarget.style.transition = 'none'
        }
        if (this.hasPanelTarget) {
            this.panelTarget.style.transition = 'none'
        }
        if (this.hasCloseBtnTarget) {
            this.closeBtnTarget.style.transition = 'none'
        }
        if (this.hasOpenBtnTarget) {
            this.openBtnTarget.style.transition = 'none'
        }
    }

    enableAnimations() {
        // Włącz animacje z powrotem
        if (this.hasMainContentTarget) {
            this.mainContentTarget.style.transition = 'margin-left 0.3s ease'
        }
        if (this.hasPanelTarget) {
            this.panelTarget.style.transition = 'transform 0.3s ease'
        }
        if (this.hasCloseBtnTarget) {
            this.closeBtnTarget.style.transition = 'opacity 0.3s ease'
        }
        if (this.hasOpenBtnTarget) {
            this.openBtnTarget.style.transition = 'opacity 0.3s ease'
        }
    }

    initializeSidebarStateImmediately() {
        const savedState = localStorage.getItem('sidebarOpen')

        if (savedState === 'true') {
            this.restoreOpenStateImmediately()
        } else {
            this.ensureClosedStateImmediately()
        }
    }

    restoreOpenStateImmediately() {
        if (!this.hasSidebarTarget || !this.hasPanelTarget || !this.hasCloseBtnTarget) {
            return
        }

        // Ustaw stan natychmiastowo bez animacji
        this.sidebarTarget.classList.remove('hidden')
        this.panelTarget.classList.remove('-translate-x-full')
        this.panelTarget.classList.add('translate-x-0')
        this.closeBtnTarget.classList.remove('opacity-0')
        this.closeBtnTarget.classList.add('opacity-100')

        this.isOpen = true
        this.adjustMainContentMarginImmediately()
        this.updateButtonVisibilityImmediately()
    }

    ensureClosedStateImmediately() {
        if (!this.hasSidebarTarget || !this.hasPanelTarget || !this.hasCloseBtnTarget) {
            return
        }

        // Ustaw stan natychmiastowo bez animacji
        this.sidebarTarget.classList.add('hidden')
        this.panelTarget.classList.add('-translate-x-full')
        this.panelTarget.classList.remove('translate-x-0')
        this.closeBtnTarget.classList.add('opacity-0')
        this.closeBtnTarget.classList.remove('opacity-100')

        this.isOpen = false
        this.adjustMainContentMarginImmediately()
        this.updateButtonVisibilityImmediately()
    }

    adjustMainContentMarginImmediately() {
        if (this.hasMainContentTarget) {
            if (this.isOpen) {
                this.mainContentTarget.style.marginLeft = `${this.sidebarWidth}px`
            } else {
                this.mainContentTarget.style.marginLeft = '0px'
            }
        }
    }

    updateButtonVisibilityImmediately() {
        if (this.hasOpenBtnTarget) {
            if (this.isOpen) {
                this.openBtnTarget.classList.add('opacity-0', 'pointer-events-none')
                this.openBtnTarget.classList.remove('opacity-100')
            } else {
                this.openBtnTarget.classList.remove('opacity-0', 'pointer-events-none')
                this.openBtnTarget.classList.add('opacity-100')
            }
        }
    }

    // Metody do normalnego otwierania/zamykania z animacjami
    open() {
        if (this.isOpen || !this.hasSidebarTarget) return

        this.sidebarTarget.classList.remove('hidden')
        localStorage.setItem('sidebarOpen', 'true')

        requestAnimationFrame(() => {
            this.panelTarget.classList.remove('-translate-x-full')
            this.panelTarget.classList.add('translate-x-0')

            this.closeBtnTarget.classList.remove('opacity-0')
            this.closeBtnTarget.classList.add('opacity-100')

            this.isOpen = true
            this.adjustMainContentMarginImmediately()
            this.updateButtonVisibilityImmediately()
        })
    }

    close() {
        if (!this.isOpen || !this.hasSidebarTarget) return

        localStorage.setItem('sidebarOpen', 'false')

        this.panelTarget.classList.remove('translate-x-0')
        this.panelTarget.classList.add('-translate-x-full')

        this.closeBtnTarget.classList.remove('opacity-100')
        this.closeBtnTarget.classList.add('opacity-0')

        setTimeout(() => {
            if (!this.isOpen) {
                this.sidebarTarget.classList.add('hidden')
            }
        }, 300)

        this.isOpen = false
        this.adjustMainContentMarginImmediately()
        this.updateButtonVisibilityImmediately()
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close()
        }
    }
}