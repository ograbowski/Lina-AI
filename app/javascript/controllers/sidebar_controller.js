// app/javascript/controllers/sidebar_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "sidebar", "panel", "closeBtn" ]

    // Inicjalizacja stanu
    initialize() {
        this.isOpen = false
    }

    connect() {
        this.handleKeyDown = this.handleKeyDown.bind(this)
        document.addEventListener('keydown', this.handleKeyDown)

        // Przywróć ostatni stan sidebara z localStorage
        const savedState = localStorage.getItem('sidebarOpen')
        if (savedState === 'true') {
            // Przywracamy stan bez animacji (sidebar już jest otwarty)
            this.restoreOpenState()
        }
    }

    disconnect() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    // Przywraca stan otwartego sidebara bez animacji
    restoreOpenState() {
        this.sidebarTarget.classList.remove('hidden')

        this.panelTarget.classList.remove('-translate-x-full')
        this.panelTarget.classList.add('translate-x-0')

        this.closeBtnTarget.classList.remove('opacity-0')
        this.closeBtnTarget.classList.add('opacity-100')

        this.isOpen = true
    }

    // Obsługa otwierania sidebara
    open() {
        if (this.isOpen) return

        // Pokazujemy container
        this.sidebarTarget.classList.remove('hidden')

        // Zapisz stan do localStorage
        localStorage.setItem('sidebarOpen', 'true')

        // Dajemy czas na zaaplikowanie klas przed animacją
        requestAnimationFrame(() => {
            // Animujemy wysuwanie panelu
            this.panelTarget.classList.remove('-translate-x-full')
            this.panelTarget.classList.add('translate-x-0')

            // Animujemy przycisk zamknięcia
            this.closeBtnTarget.classList.remove('opacity-0')
            this.closeBtnTarget.classList.add('opacity-100')

            this.isOpen = true
        })
    }

    // Obsługa zamykania sidebara
    close() {
        if (!this.isOpen) return

        // Zapisz stan do localStorage
        localStorage.setItem('sidebarOpen', 'false')

        // Rozpoczynamy animacje zamykania
        this.panelTarget.classList.remove('translate-x-0')
        this.panelTarget.classList.add('-translate-x-full')

        this.closeBtnTarget.classList.remove('opacity-100')
        this.closeBtnTarget.classList.add('opacity-0')

        // Po zakończeniu animacji ukrywamy sidebar
        setTimeout(() => {
            if (!this.isOpen) {
                this.sidebarTarget.classList.add('hidden')
            }
        }, 300) // czas trwania animacji (300ms)

        this.isOpen = false
    }

    // Zamyka sidebar po naciśnięciu klawisza Escape
    handleKeyDown(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close()
        }
    }
}