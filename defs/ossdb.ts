/**
 * Created by sungwoo on 14. 9. 1.
 */

/// <reference path="sails.ts" />

interface TOssp {
    name: string;
    description: string;
    projectUrl: string;
}

interface OsspModel extends Model<TOssp, TOssp> {

}

declare var Ossp: OsspModel;

interface TLicense {
    id?: number;
    name: string;
    longName?: string;
    description?: string;
    distributeLicense?: boolean;
    distributeSource?: boolean;
}

interface LicenseModel extends Model<TLicense, TLicense> {

}

declare var License: LicenseModel;

interface TProject {
    projectId: string;
    packages?: any[];
}

interface ProjectModel extends Model<TProject, TProject> {

}

declare var Project: ProjectModel;

interface TPackage {
    id?: number;
    name: string;
    type?: string;
    ossp?: TOssp;
    license?: TLicense;
    projects?: TProject[];
}

interface PackageModel extends Model<TPackage, TPackage> {

}

declare var Package: PackageModel;

interface TUser {
    name: string;
    email: string;
    title: string;
    encryptedPassword: string;
}

interface UserModel extends Model<TUser, TUser> {

}

declare var User: UserModel;

interface TProjectSubmit {
    project: TProject;
    packages: TPackage[];
}

interface ProjectSubmitModel extends Model<TProjectSubmit, TProjectSubmit> {

}

declare var ProjectSubmit: ProjectSubmitModel;