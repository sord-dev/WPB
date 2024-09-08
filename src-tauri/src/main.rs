// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use files::{Page, Project};
use tauri::Runtime;
mod files;


#[tauri::command]
async fn scan_for_projects<R: Runtime>(_app: tauri::AppHandle<R>, _window: tauri::Window<R>) -> Result<String, String> {
  let projects = files::scan_documents_directory("wpb-projects").map_err(|e| e.to_string())?;
  
  Ok(serde_json::json!(&projects).to_string())
}

#[tauri::command]
async fn update_project<R: Runtime>(_app: tauri::AppHandle<R>, _window: tauri::Window<R>, project_path: String, updated_project_data: serde_json::Value) -> Result<Project, String> {
  let project_file: &str = project_path.split("/").last().unwrap();
  println!("Updating project: {}", project_file);

  let project = files::update_json_in_file("wpb-projects", project_file, &updated_project_data).map_err(|e| e.to_string())?;

  Ok(project)
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![scan_for_projects, update_project])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
