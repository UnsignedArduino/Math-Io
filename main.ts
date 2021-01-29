namespace SpriteKind {
    export const Equipement = SpriteKind.create()
    export const Generator = SpriteKind.create()
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
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.background(function () {
        if (!(blockMenu.isMenuOpen())) {
            enable_cursor(false, false)
            blockMenu.showMenu(["Cancel", "Delete", "Add"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                if (on_deleteable_tile(sprite_cursor_box)) {
                    tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`transparency16`)
                } else if (on_deleteable_sprite(sprite_cursor_box) != sprite_cursor_box) {
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
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controls_enabled) {
        enable_cursor(true, true)
    }
})
function on_deleteable_sprite (sprite: Sprite) {
    for (let kind of [SpriteKind.Generator]) {
        for (let sprite_sprite of grid.getSprites(tiles.locationOfSprite(sprite))) {
            if (sprite_sprite.kind() == kind) {
                return sprite_sprite
            }
        }
    }
    return sprite
}
function on_deleteable_tile (sprite: Sprite) {
    for (let tile of [
    assets.tile`conveyor_right`,
    assets.tile`conveyor_left`,
    assets.tile`conveyor_up`,
    assets.tile`conveyor_down`,
    assets.tile`conveyor_up_left`,
    assets.tile`conveyor_up_right`,
    assets.tile`conveyor_down_left`,
    assets.tile`conveyor_down_right`,
    assets.tile`conveyor_right_down`,
    assets.tile`conveyor_right_up`,
    assets.tile`conveyor_left_down`,
    assets.tile`conveyor_left_up`
    ]) {
        if (sprite.tileKindAt(TileDirection.Center, tile)) {
            if (grid.getSprites(tiles.locationOfSprite(sprite)).length == 0) {
                return true
            }
        }
    }
    return false
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
function ask_for_conveyor () {
    while (true) {
        blockMenu.showMenu([
        "Cancel",
        "Last placed conveyor belt",
        "^ Up ^",
        "v Down v",
        "< Left <",
        "> Right >"
        ], MenuStyle.Grid, MenuLocation.BottomHalf)
        wait_for_select()
        if (blockMenu.selectedMenuIndex() == 0) {
            break;
        } else if (blockMenu.selectedMenuIndex() == 1) {
            tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), last_placed_belt)
            break;
        } else if (blockMenu.selectedMenuIndex() == 2) {
            blockMenu.showMenu(["Back", "^ Up straight ^", "^< Up left ^<", "^> Up right ^>"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_up`)
                last_placed_belt = assets.tile`conveyor_up`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_up_left`)
                last_placed_belt = assets.tile`conveyor_up_left`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_up_right`)
                last_placed_belt = assets.tile`conveyor_up_right`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
        } else if (blockMenu.selectedMenuIndex() == 3) {
            blockMenu.showMenu(["Back", "v Down straight v", "v< Down left v<", "v> Down right v>"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_down`)
                last_placed_belt = assets.tile`conveyor_down`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_down_left`)
                last_placed_belt = assets.tile`conveyor_down_left`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_down_right`)
                last_placed_belt = assets.tile`conveyor_down_right`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
        } else if (blockMenu.selectedMenuIndex() == 4) {
            blockMenu.showMenu(["Back", "< Straight left <", "<^ Left up <^", "<v Left down <v"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_left`)
                last_placed_belt = assets.tile`conveyor_left`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_left_up`)
                last_placed_belt = assets.tile`conveyor_left_up`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_left_down`)
                last_placed_belt = assets.tile`conveyor_left_down`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
        } else if (blockMenu.selectedMenuIndex() == 5) {
            blockMenu.showMenu(["Back", "> Straight right >", ">^ Right up >^", ">v Right down >v"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_right`)
                last_placed_belt = assets.tile`conveyor_right`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_right_up`)
                last_placed_belt = assets.tile`conveyor_right_up`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_right_down`)
                last_placed_belt = assets.tile`conveyor_right_down`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
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
        blockMenu.showMenu(["Cancel", "Last placed equipment", "Generator"], MenuStyle.Grid, MenuLocation.BottomHalf)
        wait_for_select()
        if (blockMenu.selectedMenuIndex() == 0) {
            break;
        } else if (blockMenu.selectedMenuIndex() == 1) {
            sprite_equipment = sprites.create(last_placed_equipement, SpriteKind.Generator)
            tiles.placeOnTile(sprite_equipment, tiles.locationOfSprite(sprite_cursor_box))
            break;
        } else if (blockMenu.selectedMenuIndex() == 2) {
            blockMenu.showMenu(["Back", "^ Generator up ^", "> Generator right >", "v Generator down v", "< Generator left <"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                sprite_equipment = sprites.create(assets.image`generator_up`, SpriteKind.Generator)
                last_placed_equipement = assets.image`generator_up`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                sprite_equipment = sprites.create(assets.image`generator_right`, SpriteKind.Generator)
                last_placed_equipement = assets.image`generator_right`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                sprite_equipment = sprites.create(assets.image`generator_down`, SpriteKind.Generator)
                last_placed_equipement = assets.image`generator_down`
            } else if (blockMenu.selectedMenuIndex() == 4) {
                sprite_equipment = sprites.create(assets.image`generator_left`, SpriteKind.Generator)
                last_placed_equipement = assets.image`generator_left`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                tiles.placeOnTile(sprite_equipment, tiles.locationOfSprite(sprite_cursor_box))
                grid.snap(sprite_equipment)
                break;
            }
        }
    }
}
blockMenu.onMenuOptionSelected(function (option, index) {
    selected = true
})
// TODO: 
// - Convert belts to sprites
// - Make generators work
// - Make number spawning work
// - Make conveyor belts work
// - Make target work
let sprite_equipment: Sprite = null
let selected = false
let sprite_cursor: Sprite = null
let sprite_cursor_pointer: Sprite = null
let controls_enabled = false
let sprite_cursor_box: Sprite = null
let target_needed = 0
let target_number = 0
let last_placed_equipement: Image = null
let last_placed_belt: Image = null
make_map()
make_cursor()
blockMenu.setColors(1, 15)
last_placed_belt = assets.tile`conveyor_up`
last_placed_equipement = assets.image`generator_up`
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
