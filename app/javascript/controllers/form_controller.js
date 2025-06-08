import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["submit", "input"]

    disable() {
        this.submitTarget.disabled = true
        this.submitTarget.textContent = "Sending..."
        this.inputTarget.disabled = true
    }

    enable() {
        this.submitTarget.disabled = false
        this.submitTarget.textContent = "Send"
        this.inputTarget.disabled = false
        this.inputTarget.value = ""
        this.inputTarget.focus()
    }
}
