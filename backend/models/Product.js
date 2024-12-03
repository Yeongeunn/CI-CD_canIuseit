const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');
const User = require('./User'); // User 모델을 불러옴

// Product 모델 정의
const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, // 기본 키 설정
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: false, 
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category, // Category 모델을 참조
            key: 'categoryId',
        },
        allowNull: false,
    },
    userId: { // User 모델을 참조하는 필드 추가
        type: DataTypes.INTEGER,
        references: {
            model: User, // User 모델을 참조
            key: 'userId',
        },
        allowNull: false, // 사용자 ID는 필수 입력 항목
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // 생성 시 자동으로 현재 시간 설정
    },
    productImagePath: { // 업로드된 이미지 경로를 저장하는 필드 추가
        type: DataTypes.STRING,
        allowNull: true, // 이미지는 선택 사항으로 설정
    },
}, {
    tableName: 'products', // 테이블 이름 명시적 지정
    timestamps: false, // 타임스탬프 비활성화 (created_at을 명시적으로 사용하므로)
});

// Category와 Product 간의 관계 설정
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// User와 Product 간의 관계 설정
Product.belongsTo(User, { foreignKey: 'userId' });

module.exports = Product;