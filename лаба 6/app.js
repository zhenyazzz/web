class DepartmentManager {
    constructor() {
      this.departments = new Map(); // Хранение списков сотрудников
      this.headers = new Set();     // Хранение заголовков отделов
      
      // Инициализация начальных данных
      this.initializeData();
      this.renderDepartments();
    }
    
    initializeData() {
      // Заполнение Map (отдел → массив фамилий)
      this.departments.set(1, ['Иванов', 'Петров']);
      this.departments.set(2, ['Сидоров', 'Кузнецов']);
      this.departments.set(3, ['Смирнов', 'Васильев']);
      
      // Заполнение Set заголовками
      this.headers.add('Разработка');
      this.headers.add('Маркетинг');
      this.headers.add('Бухгалтерия');
    }
    
    renderDepartments() {
      const container = document.getElementById('departments-container');
      container.innerHTML = '';
      
      let headerIndex = 0;
      this.departments.forEach((employees, deptId) => {
        // Создание блока отдела
        const deptBlock = document.createElement('div');
        deptBlock.className = 'department';
        
        // Добавление заголовка
        const header = document.createElement('h1');
        header.textContent = Array.from(this.headers)[headerIndex++];
        deptBlock.appendChild(header);
        
        // Добавление нумерованного списка
        const list = document.createElement('ol');
        employees.forEach(employee => {
          const item = document.createElement('li');
          item.textContent = employee;
          list.appendChild(item);
        });
        
        deptBlock.appendChild(list);
        container.appendChild(deptBlock);
      });
    }
  }
  class DepartmentEditor extends DepartmentManager {
    addEmployee(deptId, employee, position = 'end', relativePos = null) {
      if (!this.departments.has(deptId)) return false;
      
      const employees = this.departments.get(deptId);
      
      switch(position) {
        case 'start':
          employees.unshift(employee);
          break;
        case 'end':
          employees.push(employee);
          break;
        case 'before':
          if (relativePos >= 0 && relativePos < employees.length) {
            employees.splice(relativePos, 0, employee);
          }
          break;
        case 'after':
          if (relativePos >= 0 && relativePos < employees.length) {
            employees.splice(relativePos + 1, 0, employee);
          }
          break;
      }
      
      this.renderDepartments();
      return true;
    }
    
    updateHeader(index, newText) {
      const headers = Array.from(this.headers);
      if (index >= 0 && index < headers.length) {
        this.headers.delete(headers[index]);
        this.headers.add(newText);
        this.renderDepartments();
        return true;
      }
      return false;
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const manager = new DepartmentEditor();
    
    // Обработчик добавления сотрудника
    document.getElementById('add-employee').addEventListener('click', () => {
      const deptId = parseInt(document.getElementById('dept-select').value);
      const employee = document.getElementById('new-employee').value.trim();
      const position = document.getElementById('position-select').value;
      
      if (employee) {
        manager.addEmployee(deptId, employee, position);
        document.getElementById('new-employee').value = '';
      }
    });
    
    // Обработчик изменения заголовка
    document.getElementById('change-header').addEventListener('click', () => {
      const index = parseInt(document.getElementById('header-select').value) - 1;
      const newText = document.getElementById('new-header').value.trim();
      
      if (newText) {
        manager.updateHeader(index, newText);
        document.getElementById('new-header').value = '';
      }
    });
  });