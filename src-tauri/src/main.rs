// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use files::Project;
mod files;


#[tauri::command]
async fn scan_for_projects() -> Result<String, String> {
  let projects: Vec<Project> = files::scan_documents_directory().map_err(|e| e.to_string())?;
  
  Ok(serde_json::json!(&projects).to_string())
}

#[tauri::command]
async fn update_project(project_path: String, updated_project_data: String) -> Result<String, String> {
  let project_file: &str = project_path.split("/").last().unwrap();
  println!("Updating project: {}", project_file);

  let project: Project = files::update_json_in_file(project_file, &updated_project_data).map_err(|e| e.to_string())?;

  Ok(serde_json::json!(&project).to_string())
}

#[tauri::command]
async fn get_project(project_path: String) -> Result<Project, String> {
  let project_file: &str = project_path.split("\\").last().unwrap();
  println!("Getting project: {}", project_file);

  let project: Project = files::read_project_file(project_file).map_err(|e| e.to_string())?;

  Ok(project)
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![scan_for_projects, update_project, get_project])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
