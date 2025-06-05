class OpenaiService
  include HTTParty

  def initialize
    @client = OpenAI::Client.new
  end

  def chat_completion(messages, options = {})
    default_options = {
      model: "gpt-3.5-turbo",
      messages: format_message(messages),
      temperature: 0.7,
      max_tokens: 1000
    }

    response = @client.chat(
      parameters: default_options.merge(options)
    )

    handle_response(response)
  rescue => e
    Rails.logger.error "OpenAi API error: #{e.message}"
    { error: "Przepraszam, wystąpił błąd podczas komunikacji z AI" }
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

    [system_message + formatted]
  end

  def handle_response(response)
    if response.dig("choices", 0, "message", "content")
      {
        success: true,
        content: response.dig("choices", 0, "message", "content").strip
      }
    else
      { error: "Nie otrzymałem odpowiedzi od AI" }
    end
  end
end