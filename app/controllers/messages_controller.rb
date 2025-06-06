
class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversation, only: [ :create ]

  def create
    @user_message = @conversation.add_user_message(message_params[:content])

    respond_to do |format|
      if @user_message.persisted?
        # Wywołaj OpenAI w tle
        GenerateAiResponseJob.perform_later(@conversation)

        format.turbo_stream { render turbo_stream: turbo_stream.replace("new-message-form", partial: "form", locals: { conversation: @conversation, new_message: Message.new }) }
        format.html { redirect_to @conversation }
      else
        format.html { redirect_to @conversation, alert: "Błąd przy wysyłaniu wiadomości" }
      end
    end
  end

  private

  def set_conversation
    @conversation = current_user.conversations.find(params[:conversation_id])
  end

  def message_params
    params.require(:message).permit(:content)
  end

  def update_conversation_title
    first_message = @conversation.messages.where(role: "user").first
    title = first_message.content.truncate(30)
    @conversation.update(title: title)
  end
end
