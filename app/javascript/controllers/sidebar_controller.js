import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [
        "sidebar", "panel", "closeBtn", "mainContent", "openBtn",
        "desktopSidebar", "desktopPanel", "desktopCloseBtn"
    ]

    initialize() {
        this.isOpen = false
        this.sidebarWidth = 224 // w-56 = 224px
    }

    connect() {
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleResize = this.handleResize.bind(this)

        document.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('resize', this.handleResize)

        // Wyłącz animacje podczas inicjalizacji
        this.disableAnimations()
        this.initializeSidebarState()

        setTimeout(() => {
            this.enableAnimations()
        }, 100)

        this.handleTurboEvents()
    }

    disconnect() {
        document.removeEventListener('keydown', this.handleKeyDown)
        window.removeEventListener('resize', this.handleResize)
    }

    handleTurboEvents() {
        const handleStateRestore = () => {
            this.disableAnimations()
            this.initializeSidebarState()
            setTimeout(() => {
                this.enableAnimations()
            }, 100)
        }

        document.addEventListener('turbo:load', handleStateRestore)
        document.addEventListener('turbo:render', handleStateRestore)
    }

    handleResize() {
        // Przy zmianie rozmiaru okna, zaktualizuj stan
        this.initializeSidebarState()
    }

    isDesktop() {
        return window.innerWidth >= 768 // lg breakpoint
    }

    disableAnimations() {
        const elements = [
            this.hasMainContentTarget ? this.mainContentTarget : null,
            this.hasPanelTarget ? this.panelTarget : null,
            this.hasDesktopPanelTarget ? this.desktopPanelTarget : null,
            this.hasCloseBtnTarget ? this.closeBtnTarget : null,
            this.hasDesktopCloseBtnTarget ? this.desktopCloseBtnTarget : null,
            this.hasOpenBtnTarget ? this.openBtnTarget : null
        ].filter(Boolean)

        elements.forEach(el => {
            el.style.transition = 'none'
        })
    }

    enableAnimations() {
        if (this.hasMainContentTarget) {
            this.mainContentTarget.style.transition = 'margin-left 0.3s ease'
        }
        if (this.hasPanelTarget) {
            this.panelTarget.style.transition = 'transform 0.3s ease'
        }
        if (this.hasDesktopPanelTarget) {
            this.desktopPanelTarget.style.transition = 'transform 0.3s ease'
        }
        if (this.hasCloseBtnTarget) {
            this.closeBtnTarget.style.transition = 'opacity 0.3s ease'
        }
        if (this.hasDesktopCloseBtnTarget) {
            this.desktopCloseBtnTarget.style.transition = 'opacity 0.3s ease'
        }
        if (this.hasOpenBtnTarget) {
            this.openBtnTarget.style.transition = 'opacity 0.3s ease'
        }
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
        this.isOpen = true

        if (this.isDesktop()) {
            // Desktop: manipuluj layoutem
            if (this.hasDesktopSidebarTarget && this.hasDesktopPanelTarget) {
                this.desktopSidebarTarget.classList.remove('hidden')
                this.desktopPanelTarget.classList.remove('-translate-x-full')
                this.desktopPanelTarget.classList.add('translate-x-0')
            }
            this.adjustMainContentMargin()
        } else {
            // Mobile: zamknij sidebar (overlay nie powinien być otwarty przy ładowaniu)
            this.isOpen = false
            this.ensureClosedState()
            return
        }

        this.updateButtonVisibility()
    }

    ensureClosedState() {
        this.isOpen = false

        // Mobile sidebar
        if (this.hasSidebarTarget && this.hasPanelTarget) {
            this.sidebarTarget.classList.add('hidden')
            this.panelTarget.classList.add('-translate-x-full')
            this.panelTarget.classList.remove('translate-x-0')
        }

        // Desktop sidebar
        if (this.hasDesktopSidebarTarget && this.hasDesktopPanelTarget) {
            this.desktopPanelTarget.classList.add('-translate-x-full')
            this.desktopPanelTarget.classList.remove('translate-x-0')
        }

        this.adjustMainContentMargin()
        this.updateButtonVisibility()
    }

    open() {
        if (this.isOpen) return

        this.isOpen = true
        localStorage.setItem('sidebarOpen', 'true')

        if (this.isDesktop()) {
            // Desktop: slide in i adjust layout
            if (this.hasDesktopSidebarTarget && this.hasDesktopPanelTarget) {
                this.desktopSidebarTarget.classList.remove('hidden')
                requestAnimationFrame(() => {
                    this.desktopPanelTarget.classList.remove('-translate-x-full')
                    this.desktopPanelTarget.classList.add('translate-x-0')
                })
            }
            this.adjustMainContentMargin()
        } else {
            // Mobile: overlay
            if (this.hasSidebarTarget && this.hasPanelTarget) {
                this.sidebarTarget.classList.remove('hidden')
                requestAnimationFrame(() => {
                    this.panelTarget.classList.remove('-translate-x-full')
                    this.panelTarget.classList.add('translate-x-0')

                    if (this.hasCloseBtnTarget) {
                        this.closeBtnTarget.classList.remove('opacity-0')
                        this.closeBtnTarget.classList.add('opacity-100')
                    }
                })
            }
        }

        this.updateButtonVisibility()
    }

    close() {
        if (!this.isOpen) return

        this.isOpen = false
        localStorage.setItem('sidebarOpen', 'false')

        if (this.isDesktop()) {
            // Desktop
            if (this.hasDesktopPanelTarget) {
                this.desktopPanelTarget.classList.remove('translate-x-0')
                this.desktopPanelTarget.classList.add('-translate-x-full')
            }
            this.adjustMainContentMargin()
        } else {
            // Mobile
            if (this.hasPanelTarget) {
                this.panelTarget.classList.remove('translate-x-0')
                this.panelTarget.classList.add('-translate-x-full')

                if (this.hasCloseBtnTarget) {
                    this.closeBtnTarget.classList.remove('opacity-100')
                    this.closeBtnTarget.classList.add('opacity-0')
                }

                setTimeout(() => {
                    if (!this.isOpen && this.hasSidebarTarget) {
                        this.sidebarTarget.classList.add('hidden')
                    }
                })
            }
        }

        this.updateButtonVisibility()
    }

    adjustMainContentMargin() {
        if (this.hasMainContentTarget) {
            if (this.isDesktop() && this.isOpen) {
                this.mainContentTarget.style.marginLeft = `${this.sidebarWidth}px`
            } else {
                this.mainContentTarget.style.marginLeft = '0px'
            }
        }
    }

    updateButtonVisibility() {
        if (this.hasOpenBtnTarget) {
            if (this.isOpen && this.isDesktop()) {
                this.openBtnTarget.classList.add('opacity-0', 'pointer-events-none')
                this.openBtnTarget.classList.remove('opacity-100')
            } else {
                this.openBtnTarget.classList.remove('opacity-0', 'pointer-events-none')
                this.openBtnTarget.classList.add('opacity-100')
            }
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close()
        }
    }
}