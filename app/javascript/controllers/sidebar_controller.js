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

        requestAnimationFrame(() => {
            this.initializeSidebarState()
        })

        // Nasłuchuj na Turbo events
        document.addEventListener('turbo:load', () => {
            requestAnimationFrame(() => {
                this.initializeSidebarState()
            })
        })

        document.addEventListener('turbo:render', () => {
            requestAnimationFrame(() => {
                this.initializeSidebarState()
            })
        })
    }

    disconnect() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    initializeSidebarState() {
        const savedState = localStorage.getItem('sidebarOpen')

        if (savedState === 'true') {
            this.restoreOpenState()
        } else {
            this.ensureClosedState()
        }
    }

    restoreOpenState() {
        if (!this.hasSidebarTarget || !this.hasPanelTarget || !this.hasCloseBtnTarget) {
            return
        }

        this.sidebarTarget.classList.remove('hidden')
        this.panelTarget.classList.remove('-translate-x-full')
        this.panelTarget.classList.add('translate-x-0')
        this.closeBtnTarget.classList.remove('opacity-0')
        this.closeBtnTarget.classList.add('opacity-100')

        this.isOpen = true
        this.adjustMainContentMargin()
        this.updateButtonVisibility()
    }

    ensureClosedState() {
        if (!this.hasSidebarTarget || !this.hasPanelTarget || !this.hasCloseBtnTarget) {
            return
        }

        this.sidebarTarget.classList.add('hidden')
        this.panelTarget.classList.add('-translate-x-full')
        this.panelTarget.classList.remove('translate-x-0')
        this.closeBtnTarget.classList.add('opacity-0')
        this.closeBtnTarget.classList.remove('opacity-100')

        this.isOpen = false
        this.adjustMainContentMargin()
        this.updateButtonVisibility()
    }

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
            this.adjustMainContentMargin()
            this.updateButtonVisibility()
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
        this.adjustMainContentMargin()
        this.updateButtonVisibility()
    }

    updateButtonVisibility() {
        if (this.hasOpenBtnTarget) {
            if (this.isOpen) {
                // Ukryj przycisk open gdy sidebar jest otwarty
                this.openBtnTarget.classList.add('opacity-0', 'pointer-events-none', 'disabled')
                this.openBtnTarget.classList.remove('opacity-100')
            } else {
                // Pokaż przycisk open gdy sidebar jest zamknięty
                this.openBtnTarget.classList.remove('opacity-0', 'pointer-events-none', 'disabled')
                this.openBtnTarget.classList.add('opacity-100')
            }
        }
    }



    adjustMainContentMargin() {
        if (this.hasMainContentTarget) {
            if (this.isOpen) {
                this.mainContentTarget.style.marginLeft = `${this.sidebarWidth}px`
            } else {
                this.mainContentTarget.style.marginLeft = '0px'
            }
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close()
        }
    }
}