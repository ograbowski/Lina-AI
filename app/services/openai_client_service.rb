class OpenaiClientService
  def initialize
    @client = OpenAI::Client.new
    Rails.logger.info "Groq Client initialized"
  end

  def chat_completion(messages, options = {})
    Rails.logger.info "Starting Groq chat completion with #{messages.count} messages"

    default_options = {
      model: "llama3-8b-8192", # Groq model
      messages: format_message(messages),
      temperature: 0.7,
      max_tokens: 1000
    }

    Rails.logger.info "Formatted messages: #{format_message(messages)}"

    response = @client.chat(
      parameters: default_options.merge(options)
    )

    Rails.logger.info "Groq response: #{response}"

    handle_response(response)
  rescue => e
    Rails.logger.error "Groq API error: #{e.message}"
    Rails.logger.error "Full error: #{e.inspect}"
    { success: false, error: "Przepraszam, wystąpił błąd podczas komunikacji z AI" }
  end

  private

  def format_message(messages)
    formatted = messages.map do |message|
      {
        role: message.role,
        content: message.content
      }
    end

    system_message = {
      role: "system",
      content: "Jesteś Lina, jesteś wirtualnym przyjacielem człowieka. Rozmawiaj po polsku w naturalny i ciepły sposób."
    }

    [system_message] + formatted
  end

  def handle_response(response)
    Rails.logger.info "Handling response: #{response}"

    if response.dig("choices", 0, "message", "content")
      {
        success: true,
        content: response.dig("choices", 0, "message", "content").strip
      }
    else
      Rails.logger.error "No content in response: #{response}"
      { success: false, error: "Nie otrzymałem odpowiedzi od AI" }
    end
  end
end