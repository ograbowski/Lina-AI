
// app/javascript/controllers/sidebar_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "sidebar", "backdrop", "panel", "closeBtn" ]

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
        document.body.classList.add('overflow-hidden')

        this.backdropTarget.classList.remove('opacity-0')
        this.backdropTarget.classList.add('opacity-100')

        this.panelTarget.classList.remove('-translate-x-full')
        this.panelTarget.classList.add('translate-x-0')

        this.closeBtnTarget.classList.remove('opacity-0')
        this.closeBtnTarget.classList.add('opacity-100')

        this.isOpen = true
    }

    // Obsługa otwierania sidebara
    open() {
        if (this.isOpen) return

        // Pokazujemy container (ale jeszcze niewidoczne elementy)
        this.sidebarTarget.classList.remove('hidden')

        // Zapisz stan do localStorage
        localStorage.setItem('sidebarOpen', 'true')

        // Dajemy czas na zaaplikowanie klas przed animacją
        requestAnimationFrame(() => {
            // Nadajemy clasę "entering" dla elementów podczas animacji
            document.body.classList.add('overflow-hidden')

            // Animujemy backdrop (tło)
            this.backdropTarget.classList.remove('opacity-0')
            this.backdropTarget.classList.add('opacity-100')

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

        // Cofamy animacje
        this.backdropTarget.classList.remove('opacity-100')
        this.backdropTarget.classList.add('opacity-0')

        this.panelTarget.classList.remove('translate-x-0')
        this.panelTarget.classList.add('-translate-x-full')

        this.closeBtnTarget.classList.remove('opacity-100')
        this.closeBtnTarget.classList.add('opacity-0')

        // Usuwamy overflow:hidden po animacji
        document.body.classList.remove('overflow-hidden')

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