class MessagesController < ApplicationController
  before_action :set_conversation, only: [:create]

  def create
    @user_message = @conversation.add_user_message(message_params[:content])

    openai_service = OpenaiService.new
    ai_response = openai_service.chat_completion(@conversation.messages.chronological)

    if ai_response[:success]
      @conversation.add_assistant_message(ai_response[:content])

      update_conversation_title if @conversation.messages.count == 2
    else
      flash[:error] = ai_response[:error]
    end

    redirect_to @conversation
  end

  private

  def set_conversation
    @conversation = Conversation.find(params[:conversation_id])
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