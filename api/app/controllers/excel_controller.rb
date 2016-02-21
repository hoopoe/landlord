class ExcelController < ActionController::Base
  def index
    session = GoogleDrive.saved_session("api_gdrive_token.json",nil, ENV['GOOGLE_DRIVE_CLIENT_ID'], ENV['GOOGLE_DRIVE_CLIENT_SECRET'])
    ws = session.spreadsheet_by_key("1FQLeGffcQq9ipQdRx7VA_ZeaW4l7FnHic384dhxcw2M").worksheets[0]

    respond_to do |format|
      format.api { render json: "test" }
    end
  end
end
