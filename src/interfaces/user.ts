import mongoose from 'mongoose';

enum UserStatus {
    NEW = 'NEW',
    INVITED = 'INVITED',
    ACTIVE = 'ACTIVE'
};

enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
};

enum UserRoles {
    VISITOR = 'VISITOR',
    MEMBER = 'MEMBER',
    CITIZEN = 'CITIZEN',
    ELDER = 'ELDER'
};

enum UserAvatarConvertedFilenames {
    AVATAR_240 = "240x240.webp",
    AVATAR_480 = "480x480.webp",
    AVATAR_720 = "720x720.webp",
    AVATAR_970 = "970x970.webp",
    AVATAR_1920 = "1920x1920.webp"
};

interface UserAvatar {
    hair: string;
    head: string;
    eyebrow: string;
    outfit: string;
    beard: string;
    display: string;
};

const avatarSchema = new mongoose.Schema({
    hair: { type: String },
    head: { type: String },
    eyebrow: { type: String },
    outfit: { type: String },
    beard: { type: String },
    display: { type: String }
});

export {
    UserStatus,
    Gender,
    UserRoles,
    UserAvatar,
    UserAvatarConvertedFilenames,
    avatarSchema
};
