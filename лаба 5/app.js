let departments = JSON.parse(localStorage.getItem('departments')) || [];
let nextId = parseInt(localStorage.getItem('nextId')) || 1;

function saveData() {
    localStorage.setItem('departments', JSON.stringify(departments));
    localStorage.setItem('nextId', nextId.toString());
}

function addDepartment(dept) {
    departments.push(dept);
    saveData();
}

function updateDepartment(id, updatedDept) {
    const index = departments.findIndex(d => d.id === id);
    if (index !== -1) {
        departments[index] = updatedDept;
        saveData();
    }
}

function deleteDepartmentFromStorage(id) {
    if (typeof id !== 'number' || id <= 0) {
        console.error('Неверный ID департамента');
        return false;
    }

    const initialLength = departments.length;
    departments = departments.filter(d => d.id !== id);

    if (departments.length === initialLength) {
        console.warn(`Департамент с ID ${id} не найден`);
        return false;
    }

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
    clearForm();
}