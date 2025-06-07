import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "sidebar", "panel", "closeBtn" ]

    initialize() {
        this.isOpen = false
    }

    connect() {
        this.handleKeyDown = this.handleKeyDown.bind(this)
        document.addEventListener('keydown', this.handleKeyDown)

        const savedState = localStorage.getItem('sidebarOpen')
        if (savedState === 'true') {
            this.restoreOpenState()
        }
    }

    disconnect() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    restoreOpenState() {
        this.sidebarTarget.classList.remove('hidden')

        this.panelTarget.classList.remove('-translate-x-full')
        this.panelTarget.classList.add('translate-x-0')

        this.closeBtnTarget.classList.remove('opacity-0')
        this.closeBtnTarget.classList.add('opacity-100')

        this.isOpen = true
    }

    open() {
        if (this.isOpen) return

        this.sidebarTarget.classList.remove('hidden')

        localStorage.setItem('sidebarOpen', 'true')

        requestAnimationFrame(() => {
            this.panelTarget.classList.remove('-translate-x-full')
            this.panelTarget.classList.add('translate-x-0')

            this.closeBtnTarget.classList.remove('opacity-0')
            this.closeBtnTarget.classList.add('opacity-100')

            this.isOpen = true
        })
    }

    close() {
        const isVisuallyOpen = !this.sidebarTarget.classList.contains('hidden') &&
            this.panelTarget.classList.contains('translate-x-0')

        if (!this.isOpen && !isVisuallyOpen) return

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
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close()
        }
    }
}