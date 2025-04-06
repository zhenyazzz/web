let departments = JSON.parse(localStorage.getItem('departments')) || [];
let nextId = parseInt(localStorage.getItem('nextId')) || 1;
let historyLog = JSON.parse(localStorage.getItem('historyLog')) || [];

function saveData() {
    localStorage.setItem('departments', JSON.stringify(departments));
    localStorage.setItem('nextId', nextId.toString());
    localStorage.setItem('historyLog', JSON.stringify(historyLog));
}

function addToHistory(action, id, details = {}) {
    const entry = {
        action,
        id,
        details
    };
    historyLog.unshift(entry); 
    saveData();
    renderHistory(); 
}

function renderHistory() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = `
        <h3>История изменений</h3>
        <div class="history-list">
            ${historyLog.map(entry => `
                <div class="history-entry">
                    <span class="history-action">${formatHistoryAction(entry)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function formatHistoryAction(entry) {
    switch(entry.action) {
        case 'add':
            return `Добавлен департамент ID: ${entry.id} (${entry.details.name})`;
        case 'update':
            return `Обновлен департамент ID: ${entry.id} (${entry.details.name})`;
        case 'delete':
            return `Удален департамент ID: ${entry.id}`;
        case 'property_add':
            return `Добавлено свойство "${entry.details.propName}" в департамент ID: ${entry.id}`;
        case 'property_remove':
            return `Удалено свойство "${entry.details.propName}" из департамента ID: ${entry.id}`;
        default:
            return `Выполнено действие: ${entry.action} с ID: ${entry.id}`;
    }
}

function addDepartment(dept) {
    departments.push(dept);
    addToHistory('add', dept.id, { name: dept.name });
    saveData();
}

function updateDepartment(id, updatedDept) {
    const index = departments.findIndex(d => d.id === id);
    if (index !== -1) {
        departments[index] = updatedDept;
        addToHistory('update', id, { name: updatedDept.name });
        saveData();
    }
}

function deleteDepartmentFromStorage(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return false;
    
    departments = departments.filter(d => d.id !== id);
    addToHistory('delete', id);
    
    if (departments.length === 0) {
        nextId = 1;
    }
    
    saveData();
    return true;
}

function saveDepartment() {
    const id = parseInt(document.getElementById('deptId').value);
    const dept = {
        id: id || nextId++,
        name: document.getElementById('name').value,
        manager: document.getElementById('manager').value,
        phone: document.getElementById('phone').value,
        employees: parseInt(document.getElementById('employees').value),
        address: document.getElementById('address').value,
        customProps: id ? departments.find(d => d.id === id)?.customProps || {} : {}
    };

    id ? updateDepartment(id, dept) : addDepartment(dept);
    updateUI();
}

function deleteDepartment() {
    const id = parseInt(document.getElementById('deptId').value);
    
    if (!id) {
        alert('Пожалуйста, выберите департамент для удаления');
        return;
    }

    if (!confirm(`Вы уверены, что хотите удалить департамент ID ${id}?\nЭто действие нельзя отменить!`)) {
        return;
    }

    const success = deleteDepartmentFromStorage(id);
    
    if (success) {
        updateUI();
        alert('Департамент успешно удален');
    } else {
        alert('Не удалось удалить департамент');
    }
}

function updateUI() {
    updateDeptList();
    renderTable();
    clearForm();
}

function updateDeptList() {
    const select = document.getElementById('deptId');
    select.innerHTML = '<option value="">-- Новый департамент --</option>';
    
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = `ID: ${dept.id} - ${dept.name}`;
        select.appendChild(option);
    });
}

function renderTable() {
    const tbody = document.querySelector('#deptTable tbody');
    tbody.innerHTML = '';

    departments.forEach(dept => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dept.id}</td>
            <td>${dept.name}</td>
            <td>${dept.manager}</td>
            <td>${dept.phone}</td>
            <td>${dept.employees}</td>
            <td>${dept.address}</td>
            <td>${formatCustomProps(dept.customProps)}</td>
        `;
        tbody.appendChild(row);
    });
}

function formatCustomProps(props) {
    return props ? Object.entries(props).map(([k, v]) => `${k}: ${v}`).join(', ') : '';
}

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    
    document.getElementById('deptId').addEventListener('change', function() {
        const id = parseInt(this.value);
        if (!id) return clearForm();
        
        const dept = departments.find(d => d.id === id);
        if (dept) {
            document.getElementById('name').value = dept.name;
            document.getElementById('manager').value = dept.manager;
            document.getElementById('phone').value = dept.phone;
            document.getElementById('employees').value = dept.employees;
            document.getElementById('address').value = dept.address;
        }
    });
});

function clearForm() {
    document.getElementById('deptForm').reset();
    document.getElementById('deptId').value = '';
}

function addProperty() {
    const id = parseInt(document.getElementById('deptId').value);
    if (!id) return alert('Выберите департамент!');

    const propName = document.getElementById('newPropName').value.trim();
    const propValue = document.getElementById('newPropValue').value.trim();
    if (!propName || !propValue) return alert('Заполните оба поля!');

    const dept = departments.find(d => d.id === id);
    if (dept) {
        dept.customProps = dept.customProps || {};
        dept.customProps[propName] = propValue;
        addToHistory('property_add', id, { propName });
        saveData();
        renderTable();
        document.getElementById('newPropName').value = '';
        document.getElementById('newPropValue').value = '';
    }
}

function showAnalytics() {
    if (departments.length === 0) return alert('Нет данных!');

    const sorted = [...departments].sort((a, b) => a.employees - b.employees);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    document.getElementById('analyticsResult').innerHTML = `
        <strong>Минимум сотрудников:</strong> ${min.manager} (${min.employees})<br>
        <strong>Максимум сотрудников:</strong> ${max.manager} (${max.employees})
    `;
}
function updatePropertiesList() {
    const select = document.getElementById('propToRemove');
    select.innerHTML = '<option value="">-- Выберите свойство --</option>';
    
    const allProps = new Set();
    departments.forEach(dept => {
        if (dept.customProps) {
            Object.keys(dept.customProps).forEach(prop => allProps.add(prop));
        }
    });
    
    allProps.forEach(prop => {
        const option = document.createElement('option');
        option.value = prop;
        option.textContent = prop;
        select.appendChild(option);
    });
}

function removeProperty() {
    const propName = document.getElementById('propToRemove').value;
    if (!propName) return alert('Выберите свойство!');
    
    if (confirm(`Удалить свойство "${propName}" из всех департаментов?`)) {
        departments.forEach(dept => {
            if (dept.customProps && dept.customProps[propName]) {
                delete dept.customProps[propName];
                addToHistory('property_remove', dept.id, { propName });
            }
        });
        
        saveData();
        updatePropertiesList();
        renderTable();
        alert(`Свойство "${propName}" успешно удалено!`);
    }
}

function updateUI() {
    updateDeptList();
    updatePropertiesList(); 
    renderTable();
    renderHistory();
    clearForm();
}