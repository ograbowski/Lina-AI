class ConversationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversation, only: [ :show, :destroy ]

  def index
    @conversations = current_user.conversations.joins(:messages).distinct.order(updated_at: :desc)
  end

  def show
    if @conversation.messages.empty?
      redirect_to conversations_path, alert: "Conversation not found or empty."
      return
    end

    messages_order
    @new_message = Message.new
  end

  def new
    @new_message = Message.new
  end

  def create
    redirect_to new_conversation_path
  end

  def destroy
    @conversation.destroy
    redirect_to conversations_path
  end

  def messages_order
    @messages = @conversation.messages.chronological
  end

  private

  def set_conversation
    @conversation = current_user.conversations.find(params[:id])
  end
end
