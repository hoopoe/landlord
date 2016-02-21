class ExcelController < ActionController::Base
  def index
    session = GoogleDrive.saved_session("api_gdrive_token.json",nil, ENV['GOOGLE_DRIVE_CLIENT_ID'], ENV['GOOGLE_DRIVE_CLIENT_SECRET'])
    ws = session.spreadsheet_by_key("1FQLeGffcQq9ipQdRx7VA_ZeaW4l7FnHic384dhxcw2M").worksheets[0]

    items = []
    (1..ws.num_rows).each do |row|
      items << {:id => ws[row,1], :desc => ws[row,2]}
    end

    respond_to do |format|
      format.json { render json: items }
    end
  end

  def show
    spreadsheet_id = params[:id]
    session = GoogleDrive.saved_session("api_gdrive_token.json",nil, ENV['GOOGLE_DRIVE_CLIENT_ID'], ENV['GOOGLE_DRIVE_CLIENT_SECRET'])
    ws = session.spreadsheet_by_key(spreadsheet_id).worksheets[0]

    items = []
    (1..ws.num_rows).each do |row|
      items << {:id => ws[row,1], :desc => ws[row,2]}
    end

    respond_to do |format|
      format.json { render json: items }
    end
  end
end
