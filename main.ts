namespace SpriteKind {
    export const Equipement = SpriteKind.create()
    export const Generator = SpriteKind.create()
    export const Belt = SpriteKind.create()
}
function on_buildable_tile (sprite: Sprite) {
    for (let tile of [
    assets.tile`transparency8`,
    assets.tile`tile_1`,
    assets.tile`tile_2`,
    assets.tile`tile_3`,
    assets.tile`tile_0`,
    assets.tile`tile_4`,
    assets.tile`tile_5`,
    assets.tile`tile_6`,
    assets.tile`tile_7`,
    assets.tile`tile_8`,
    assets.tile`tile_9`
    ]) {
        if (sprite.tileKindAt(TileDirection.Center, tile)) {
            if (grid.getSprites(tiles.locationOfSprite(sprite)).length == 0) {
                return true
            }
        }
    }
    return false
}
function string_to_direction (direction: string) {
    if (direction == "n") {
        return CollisionDirection.Top
    } else if (direction == "e") {
        return CollisionDirection.Right
    } else if (direction == "s") {
        return CollisionDirection.Bottom
    } else if (direction == "w") {
        return CollisionDirection.Left
    } else {
        return CollisionDirection.Top
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.background(function () {
        if (!(blockMenu.isMenuOpen())) {
            enable_cursor(false, false)
            blockMenu.showMenu(["Cancel", "Delete", "Add"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                if (on_deleteable_sprite(sprite_cursor_box) != sprite_cursor_box) {
                    on_deleteable_sprite(sprite_cursor_box).destroy()
                } else {
                    game.showLongText("Cannot delete tile here!", DialogLayout.Bottom)
                }
            } else if (blockMenu.selectedMenuIndex() == 2) {
                if (on_buildable_tile(sprite_cursor_box)) {
                    blockMenu.showMenu(["Cancel", "Equipment", "Conveyor belt"], MenuStyle.List, MenuLocation.BottomHalf)
                    wait_for_select()
                    if (blockMenu.selectedMenuIndex() == 1) {
                        ask_for_equipment()
                    } else if (blockMenu.selectedMenuIndex() == 2) {
                        ask_for_conveyor()
                    }
                } else {
                    game.showLongText("Cannot place tile here!", DialogLayout.Bottom)
                }
            }
            enable_cursor(true, false)
        }
    })
})
function make_belt (image2: Image, _from: string, to: string) {
    local_sprite = sprites.create(image2, SpriteKind.Belt)
    sprites.setDataString(local_sprite, "from", _from)
    sprites.setDataString(local_sprite, "to", to)
    sprites.setDataSprite(local_sprite, "item", null)
    return local_sprite
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controls_enabled) {
        enable_cursor(true, true)
    }
})
function on_deleteable_sprite (sprite: Sprite) {
    for (let kind of [SpriteKind.Belt, SpriteKind.Generator]) {
        for (let sprite_sprite of grid.getSprites(tiles.locationOfSprite(sprite))) {
            if (sprite_sprite.kind() == kind) {
                return sprite_sprite
            }
        }
    }
    return sprite
}
spriteutils.createRenderable(150, function (screen2) {
    if (sprite_cursor_pointer.top > 12) {
        screen2.fillRect(0, 0, 160, 12, 15)
        screen2.drawLine(0, 12, 160, 12, 1)
        images.print(screen2, "Score: " + info.score(), 2, 2, 1)
    }
    if (sprite_cursor_pointer.top < tiles.tilemapRows() * tiles.tileWidth() - 12 && !(blockMenu.isMenuOpen())) {
        screen2.fillRect(0, scene.screenHeight() - 12, 160, scene.screenHeight(), 15)
        screen2.drawLine(0, scene.screenHeight() - 12, 160, scene.screenHeight() - 12, 1)
        images.print(screen2, "Target: " + target_number + " (Need " + target_needed + ")", 2, scene.screenHeight() - 10, 1)
    }
})
function make_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
    sprite_cursor.z = 99
    sprite_cursor_pointer = sprites.create(assets.image`cursor_pointer`, SpriteKind.Player)
    sprite_cursor_pointer.z = 100
    sprite_cursor_box = sprites.create(assets.image`cursor_box`, SpriteKind.Player)
    sprite_cursor_box.z = 98
    enable_cursor(true, false)
    tiles.placeOnRandomTile(sprite_cursor_pointer, assets.tile`acceptor`)
    scene.cameraFollowSprite(sprite_cursor_pointer)
    sprite_cursor_pointer.setFlag(SpriteFlag.GhostThroughWalls, true)
    sprite_cursor_pointer.setStayInScreen(true)
}
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    if (controls_enabled) {
        enable_cursor(true, false)
    }
})
function make_generator (image2: Image, to: string) {
    local_sprite = sprites.create(image2, SpriteKind.Generator)
    sprites.setDataString(local_sprite, "to", to)
    return local_sprite
}
function ask_for_conveyor () {
    while (true) {
        blockMenu.showMenu(["Cancel", "Up", "Down", "Left", "Right"], MenuStyle.Grid, MenuLocation.BottomHalf)
        wait_for_select()
        if (blockMenu.selectedMenuIndex() == 0) {
            break;
        } else if (blockMenu.selectedMenuIndex() == 1) {
            blockMenu.showMenu(["Back", "Up straight", "Up left", "Up right"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_up`, "n", "n")
            } else if (blockMenu.selectedMenuIndex() == 2) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_up_left`, "n", "w")
            } else if (blockMenu.selectedMenuIndex() == 3) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_up_right`, "n", "e")
            }
        } else if (blockMenu.selectedMenuIndex() == 3) {
            blockMenu.showMenu(["Back", "Down straight", "Down left", "Down right"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_down`, "s", "s")
            } else if (blockMenu.selectedMenuIndex() == 2) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_down_left`, "s", "w")
            } else if (blockMenu.selectedMenuIndex() == 3) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_down_right`, "s", "e")
            }
        } else if (blockMenu.selectedMenuIndex() == 4) {
            blockMenu.showMenu(["Back", "Straight left", "Left up", "Left down"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_left`, "w", "w")
            } else if (blockMenu.selectedMenuIndex() == 2) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_left_up`, "w", "n")
            } else if (blockMenu.selectedMenuIndex() == 3) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_left_down`, "w", "s")
            }
        } else if (blockMenu.selectedMenuIndex() == 5) {
            blockMenu.showMenu(["Back", "Straight right", "Right up", "Right down"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_right`, "e", "e")
            } else if (blockMenu.selectedMenuIndex() == 2) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_right_up`, "e", "n")
            } else if (blockMenu.selectedMenuIndex() == 3) {
                sprite_conveyor_belt = make_belt(assets.image`conveyor_right_down`, "e", "s")
            }
        }
        if (blockMenu.selectedMenuIndex() > 0) {
            tiles.placeOnTile(sprite_conveyor_belt, tiles.locationOfSprite(sprite_cursor_box))
            grid.snap(sprite_conveyor_belt)
            break;
        }
    }
}
function enable_cursor (en: boolean, speed: boolean) {
    controls_enabled = en
    if (en) {
        if (speed) {
            controller.moveSprite(sprite_cursor_pointer, 96, 96)
        } else {
            controller.moveSprite(sprite_cursor_pointer, 64, 64)
        }
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function make_map () {
    tiles.setSmallTilemap(tilemap`map`)
    scene.setBackgroundColor(13)
}
function wait_for_select () {
    selected = false
    while (!(selected)) {
        pause(100)
    }
    blockMenu.closeMenu()
}
function ask_for_equipment () {
    while (true) {
        blockMenu.showMenu(["Cancel", "Generator"], MenuStyle.Grid, MenuLocation.BottomHalf)
        wait_for_select()
        if (blockMenu.selectedMenuIndex() == 0) {
            break;
        } else if (blockMenu.selectedMenuIndex() == 1) {
            blockMenu.showMenu(["Back", "Generator up", "Generator right", "Generator down", "Generator left"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                sprite_equipement = make_generator(assets.image`generator_up`, "n")
            } else if (blockMenu.selectedMenuIndex() == 2) {
                sprite_equipement = make_generator(assets.image`generator_right`, "e")
            } else if (blockMenu.selectedMenuIndex() == 3) {
                sprite_equipement = make_generator(assets.image`generator_down`, "s")
            } else if (blockMenu.selectedMenuIndex() == 4) {
                sprite_equipement = make_generator(assets.image`generator_left`, "w")
            }
        }
        if (blockMenu.selectedMenuIndex() > 0) {
            tiles.placeOnTile(sprite_equipement, tiles.locationOfSprite(sprite_cursor_box))
            grid.snap(sprite_equipement)
            break;
        }
    }
}
blockMenu.onMenuOptionSelected(function (option, index) {
    selected = true
})
// TODO: 
// - Make generators work
// - Make number spawning work
// - Make conveyor belts work
// - Make target work
let next_belt_item: Sprite = null
let next_converyor_belt: Sprite = null
let belt_item: Sprite = null
let sprite_equipement: Sprite = null
let selected = false
let sprite_conveyor_belt: Sprite = null
let sprite_cursor: Sprite = null
let sprite_cursor_pointer: Sprite = null
let controls_enabled = false
let local_sprite: Sprite = null
let sprite_cursor_box: Sprite = null
let target_needed = 0
let target_number = 0
let ticks_per_second = 10
make_map()
make_cursor()
blockMenu.setColors(1, 15)
info.setScore(0)
target_number = 2
target_needed = 30
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
    sprite_cursor_box.y = sprite_cursor_pointer.top
    sprite_cursor_box.x = sprite_cursor_pointer.left
    tiles.placeOnTile(sprite_cursor_box, tiles.locationOfSprite(sprite_cursor_box))
})
forever(function () {
    timer.throttle("tick", 1000 / ticks_per_second, function () {
        for (let sprite_sprite of sprites.allOfKind(SpriteKind.Belt)) {
            belt_item = sprites.readDataSprite(sprite_sprite, "item")
            if (grid.lineAdjacentSprites(tiles.locationOfSprite(sprite_sprite), string_to_direction("abc"), 1).length == 0) {
                continue;
            } else {
                next_converyor_belt = grid.lineAdjacentSprites(tiles.locationOfSprite(sprite_sprite), string_to_direction("abc"), 1)[0]
            }
            next_belt_item = sprites.readDataSprite(next_converyor_belt, "item")
            if (belt_item && !(next_belt_item) && sprites.readDataString(sprite_sprite, "to") == sprites.readDataString(next_converyor_belt, "from")) {
                sprites.setDataSprite(next_converyor_belt, "item", belt_item)
                sprites.setDataSprite(sprite_sprite, "item", null)
                sprites.readDataSprite(next_converyor_belt, "item").follow(next_converyor_belt, 100)
            }
        }
    })
})
