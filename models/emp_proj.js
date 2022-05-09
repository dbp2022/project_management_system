const Sequelize = require('sequelize');

module.exports = class Emp_Proj extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            part_start_date:{
                type: Sequelize.DATE,
                allowNull:false
            },
            part_end_date:{
                type: Sequelize.DATE,
                allowNull:false
            },
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'Dept',
            tableName:'dept',
            paranoid:false,
            charset:UTF8,
            collate:'utf8_general_ci'
        })
    }
    static associate(db){
        db.Emp_Proj.belongsTo(db.Role, {foreignKey:'Role_id',targetKey:'id'});
        db.Emp_Proj.belongsTo(db.Employee, {foreignKey:'Employee_number',targetKey:'id'})
        db.Emp_Proj.belongsTo(db.Project, {foreignKey:'Project_id',targetKey:'id'})
        

    }
}