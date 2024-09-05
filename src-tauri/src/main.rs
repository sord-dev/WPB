// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Runtime;
mod files;

#[tauri::command]
async fn scan_for_projects<R: Runtime>(app: tauri::AppHandle<R>, window: tauri::Window<R>) -> Result<String, String> {
  let projects = files::scan_documents_directory("wpb-projects").map_err(|e| e.to_string())?;
  Ok((serde_json::json!(&projects).to_string()))
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![scan_for_projects])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
