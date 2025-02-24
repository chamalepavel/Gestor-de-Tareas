import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';

const filePath = 'tasks.json';

class TaskManager {
  constructor() {
    this.loadTasks();
  }

  loadTasks() {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      this.tasksData = JSON.parse(data);
    } catch (error) {
      this.tasksData = { tasks: [] };
    }
  }

  saveTasks() {
    fs.writeFileSync(filePath, JSON.stringify(this.tasksData, null, 2));
  }

  addTask(title) {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    this.tasksData.tasks.push(newTask);
    this.saveTasks();
    console.log(chalk.blue('Tarea agregada correctamente'));
  }

  listTasks() {
    if (this.tasksData.tasks.length === 0) {
      console.log('No hay tareas registradas.');
    } else {
      this.tasksData.tasks.forEach((task, index) => {
        console.log(chalk.underline(`${index + 1}. ${task.title} [${task.completed ? 'Completada' : 'Pendiente'}]`));
      });
    }
  }

  completeTask(taskId) {
    const task = this.tasksData.tasks[taskId - 1];
    if (task) {
      task.completed = true;
      this.saveTasks();
      console.log(chalk.green('Tarea marcada como completada.'));
    } else {
      console.log(chalk.red('Número de tarea no válido'));
    }
  }

  deleteTask(taskId) {
    if (taskId > 0 && taskId <= this.tasksData.tasks.length) {
      this.tasksData.tasks.splice(taskId - 1, 1);
      this.saveTasks();
      console.log(chalk.strikethrough('Tarea eliminada correctamente.'));
    } else {
      console.log(chalk.red('Número de tarea no válido'));
    }
  }

  showMenu() {
    console.log(chalk.bgMagenta('¡Bienvenido a mi Gestor de Tareas!'));
    console.log(chalk.blue('1. Agregar tarea'));
    console.log(chalk.green('2. Listar tareas'));
    console.log(chalk.underline('3. Marcar tarea como completada'));
    console.log(chalk.strikethrough('4. Eliminar tarea'));
    console.log(chalk.yellow('5. Salir'));
  }

  async handleUserInput() {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: '¿Qué deseas hacer?',
        choices: [
          'Agregar tarea',
          'Listar tareas',
          'Marcar tarea como completada',
          'Eliminar tarea',
          'Salir',
        ],
      },
    ]);

    switch (answers.option) {
      case 'Agregar tarea':
        const addAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Ingresa el título de la tarea:',
          },
        ]);
        this.addTask(addAnswer.title);
        break;

      case 'Listar tareas':
        this.listTasks();
        break;

      case 'Marcar tarea como completada':
        const completeAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'taskId',
            message: 'Ingresa el número de la tarea a completar:',
            validate(value) {
              if (isNaN(value) || value <= 0) {
                return 'Por favor ingresa un número válido';
              }
              return true;
            },
          },
        ]);
        this.completeTask(parseInt(completeAnswer.taskId));
        break;

      case 'Eliminar tarea':
        const deleteAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'taskId',
            message: 'Ingresa el número de la tarea a eliminar:',
            validate(value) {
              if (isNaN(value) || value <= 0) {
                return 'Por favor ingresa un número válido';
              }
              return true;
            },
          },
        ]);
        this.deleteTask(parseInt(deleteAnswer.taskId));
        break;

      case 'Salir':
        console.log(chalk.yellow('Hasta luego!'));
        return;

      default:
        break;
    }

    this.showMenu();
    this.handleUserInput(); // Recursión para continuar interactuando
  }
}

const taskManager = new TaskManager();
taskManager.showMenu();
taskManager.handleUserInput();
