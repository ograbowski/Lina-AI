class GenerateAiResponseJob < ApplicationJob
  queue_as :default

  def perform(conversation)
    openai_service = OpenaiClientService.new
    ai_response = openai_service.chat_completion(conversation.messages.chronological)

    if ai_response[:success]
      conversation.add_assistant_message(ai_response[:content])

      update_conversation_title(conversation) if conversation.messages.count == 2
    else
      # Możesz dodać obsługę błędów, np. broadcast błędu
      Rails.logger.error "OpenAI Error: #{ai_response[:error]}"
    end
  end

  private

  def update_conversation_title(conversation)
    first_message = conversation.messages.where(role: "user").first
    title = first_message.content.truncate(30)
    conversation.update(title: title)
  end
end
