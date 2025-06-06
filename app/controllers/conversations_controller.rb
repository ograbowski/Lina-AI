class ConversationsController < ApplicationController
  before_action :authenticate_user!  # DODAJ autentykację
  before_action :set_conversation, only: [ :show, :destroy ]

  def index
    @conversations = current_user.conversations.order(updated_at: :desc)
  end

  def show
    messages_order
    @new_message = Message.new
  end

  def create
    @conversation = current_user.conversations.create!(title: "New chat")
    redirect_to @conversation
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
