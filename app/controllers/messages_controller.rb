class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversation, only: [ :create ]

  def create
    @conversation = find_or_create_conversation if @conversation.nil?

    @user_message = @conversation.add_user_message(message_params[:content])

    respond_to do |format|
      if @user_message.persisted?
        update_conversation_title if @conversation.messages.where(role: "user").count == 1

        GenerateAiResponseJob.perform_later(@conversation)

        if params[:conversation_id].present?
          format.turbo_stream { render turbo_stream: turbo_stream.replace("new-message-form", partial: "form", locals: { conversation: @conversation, new_message: Message.new }) }
        else
          format.turbo_stream { redirect_to @conversation }
        end
        format.html { redirect_to @conversation }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace("new-message-form", partial: "form", locals: { conversation: @conversation, new_message: @user_message }) }
        format.html { redirect_to @conversation, alert: "Błąd przy wysyłaniu wiadomości" }
      end
    end
  end

  private

  def set_conversation
    @conversation = current_user.conversations.find(params[:conversation_id]) if params[:conversation_id].present?
  end

  def find_or_create_conversation
    if params[:conversation_id].present?
      current_user.conversations.find(params[:conversation_id])
    else
      current_user.conversations.create!(title: "New chat")
    end
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
