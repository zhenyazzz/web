class DepartmentManager {
    constructor(skipInitialization = false) {
      this.departments = new Map(); 
      this.headersSet = new Set();  
      this.deptToHeaderMap = new Map(); 
      
      if (!skipInitialization) {
        this.initializeData();
        this.renderDepartments();
      }
    }
    
    initializeData() {
      this.departments.set(1, ['Иванов', 'Петров']);
      this.departments.set(2, ['Сидоров', 'Кузнецов']);
      this.departments.set(3, ['Смирнов', 'Васильев']);
      
      const header1 = 'Разработка';
      const header2 = 'Маркетинг';
      const header3 = 'Бухгалтерия';
      
      this.headersSet.add(header1);
      this.headersSet.add(header2);
      this.headersSet.add(header3);
      
      this.deptToHeaderMap.set(1, header1);
      this.deptToHeaderMap.set(2, header2);
      this.deptToHeaderMap.set(3, header3);
    }
    
    renderDepartments() {
      const container = document.getElementById('departments-container');
      container.innerHTML = '';
      
      this.departments.forEach((employees, deptId) => {
        const deptBlock = document.createElement('div');
        deptBlock.className = 'department';
        
        const header = document.createElement('h1');
        header.textContent = this.deptToHeaderMap.get(deptId);
        deptBlock.appendChild(header);
        
        const list = document.createElement('ol');
        employees.forEach(employee => {
          const item = document.createElement('li');
          item.textContent = employee;
          list.appendChild(item);
        });
        
        deptBlock.appendChild(list);
        container.appendChild(deptBlock);
      });

      this.updateEmployeeSelect();
    }

    updateEmployeeSelect() {
      const deptId = parseInt(document.getElementById('dept-select').value);
      const employees = this.departments.get(deptId) || [];
      const empSelect = document.getElementById('employee-select');
      if (!empSelect) return;

      empSelect.innerHTML = '';
      employees.forEach((emp, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = emp;
        empSelect.appendChild(opt);
      });
    }
  }
  class DepartmentEditor extends DepartmentManager {
    constructor(departments = null, headers = null, useDefaults = true) {
      super(true); 
      
      if (useDefaults && !departments && !headers) {
        this.initializeData();
      } else {
        if (departments && departments instanceof Map) {
          this.departments = new Map(departments);
        }
        
        if (headers) {
          if (headers instanceof Map) {
            this.headersSet = new Set();
            this.deptToHeaderMap = new Map();
            let index = 1;
            headers.forEach((headerText, deptId) => {
              this.headersSet.add(headerText);
              this.deptToHeaderMap.set(deptId, headerText);
            });
          } else if (headers instanceof Set) {
            this.headersSet = new Set(headers);
            this.deptToHeaderMap = new Map();
            let index = 1;
            headers.forEach(header => {
              this.deptToHeaderMap.set(index, header);
              index++;
            });
          }
        }
      }
      
      this.renderDepartments();
    }
    
    createDepartment(deptId, headerText) {
      if (!this.departments.has(deptId)) {
        this.departments.set(deptId, []);
        this.headersSet.add(headerText);
        this.deptToHeaderMap.set(deptId, headerText);
        this.renderDepartments();
        return true;
      }
      return false;
    }
    
    getDepartmentInfo(deptId) {
      if (this.departments.has(deptId)) {
        return {
          header: this.deptToHeaderMap.get(deptId),
          employees: [...this.departments.get(deptId)]
        };
      }
      return null;
    }
    
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
          if (relativePos !== null && relativePos >= 0 && relativePos < employees.length) {
            employees.splice(relativePos, 0, employee);
          }
          break;
        case 'after':
          if (relativePos !== null && relativePos >= 0 && relativePos < employees.length) {
            employees.splice(relativePos + 1, 0, employee);
          }
          break;
      }
      
      this.renderDepartments();
      return true;
    }
    
    updateHeader(deptId, newText) {
      if (this.deptToHeaderMap.has(deptId)) {
        this.headersSet.delete(this.deptToHeaderMap.get(deptId));
        
        this.deptToHeaderMap.set(deptId, newText);
        
        this.headersSet.add(newText);
        
        this.renderDepartments();
        return true;
      }
      return false;
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const manager = new DepartmentEditor();
    
    
    document.getElementById('dept-select').addEventListener('change', () => {
      manager.updateEmployeeSelect();
    });
    manager.updateEmployeeSelect();

    document.getElementById('add-employee').addEventListener('click', () => {
      const deptId = parseInt(document.getElementById('dept-select').value);
      const employee = document.getElementById('new-employee').value.trim();
      const position = document.getElementById('position-select').value;
      const relPos = document.getElementById('employee-select').selectedIndex;
      
      if (employee) {
        if (position === 'before' || position === 'after') {
          manager.addEmployee(deptId, employee, position, relPos);
        } else {
          manager.addEmployee(deptId, employee, position);
        }
        document.getElementById('new-employee').value = '';
      }
    });
    
    document.getElementById('change-header').addEventListener('click', () => {
      const deptId = parseInt(document.getElementById('header-select').value);
      const newText = document.getElementById('new-header').value.trim();
      
      if (newText) {
        manager.updateHeader(deptId, newText);
        document.getElementById('new-header').value = '';
      }
    });
  });