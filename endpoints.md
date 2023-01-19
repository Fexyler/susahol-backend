# Project

## GetProjects
### Params
| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| string      | searchInput     | If it is null, return all projects. Else return projects if it matches project title or at least one of the tags of project |

### Return Value

| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| Project[] | projects     | projects |

#### Project Object

| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| int | id     | projects unique id |
| string | title     | projects title |
| string | description     | projects description |
| Owner | owner     | an object that holds information about projects owner |

#### Owner Object
| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| string | username     | unique username of user |
| string | firstName     | firstname |
| string | lastName     | lastname |
| string | email     | email |
| string | image     | imageUrl of user's profile photo |


## GetProjectDetail
### Params
| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| int      | id     | project's unique id |

### Return Value

| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| Project | project     | project |

#### Project Object

| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| int | id     | projects unique id |
| string | title     | projects title |
| string | description     | projects description |
| string[] | tags     | tags |
| string | image     | project's image url |
| Owner | owner     | an object that holds information about projects owner |

#### Owner Object
| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| string | username     | unique username of user |
| string | firstName     | firstname |
| string | lastName     | lastname |
| string | email     | email |
| string | about     | user's about me section |
| string | image     | imageUrl of user's profile photo |


# Profile

## GetProfile
### Params
| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| string      | username     | username of owner of profile |

### Return Value

| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| Profile | profile     | profile informations |

#### Profile Object

| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| Project[] | projects     | projects list |
| Owner | owner     | an object that holds information about projects owner |

#### Project Object
| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| int | id     | unique id of project |
| string | title     | project title |
| string | image     | imageUrl of project |



#### Owner Object
| Type  | Name | Description | 
| ------------- |:-------------:|:-------------:|
| string | username     | unique username of user |
| string | firstName     | firstname |
| string | lastName     | lastname |
| string | company     | company |
| string | department     | department |
| string | about     | about |
| string | image     | imageUrl of user's profile photo |

